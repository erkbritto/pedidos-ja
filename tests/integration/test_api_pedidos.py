import pytest
from fastapi.testclient import TestClient


def _payload_valido(**overrides: object) -> dict:
    dados = {
        "cliente": "Ana Souza",
        "produto": "Combo de Hambúrguer",
        "quantidade": 2,
        "valor_unitario": 32.90,
    }
    dados.update(overrides)
    return dados


# --- health -----------------------------------------------------------------


def test_health_retorna_200_status_ok(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


# --- POST /pedidos ------------------------------------------------------------


def test_post_pedido_valido_retorna_201_com_total_correto(client: TestClient) -> None:
    response = client.post("/pedidos", json=_payload_valido())
    assert response.status_code == 201

    body = response.json()
    assert body["status"] == "CRIADO"
    assert body["valor_total"] == 65.80
    assert isinstance(body["valor_unitario"], float)
    assert isinstance(body["valor_total"], float)
    assert body["cliente"] == "Ana Souza"
    assert body["produto"] == "Combo de Hambúrguer"
    assert body["quantidade"] == 2
    assert "id" in body
    assert "data_criacao" in body


@pytest.mark.parametrize(
    ("overrides", "motivo"),
    [
        ({"quantidade": 0}, "quantidade zero"),
        ({"quantidade": -1}, "quantidade negativa"),
        ({"valor_unitario": 0}, "valor zero"),
        ({"valor_unitario": -5}, "valor negativo"),
        ({"cliente": ""}, "cliente vazio"),
        ({"cliente": "   "}, "cliente só com espaços"),
        ({"produto": ""}, "produto vazio"),
    ],
)
def test_post_pedido_invalido_retorna_422(client: TestClient, overrides: dict, motivo: str) -> None:
    response = client.post("/pedidos", json=_payload_valido(**overrides))
    assert response.status_code == 422, f"esperava 422 para: {motivo}"


@pytest.mark.parametrize("campo_extra", ["status", "valor_total"])
def test_post_pedido_rejeita_campos_extras(client: TestClient, campo_extra: str) -> None:
    response = client.post("/pedidos", json=_payload_valido(**{campo_extra: 1}))
    assert response.status_code == 422


# --- GET /pedidos/{id} --------------------------------------------------------


def test_get_pedido_existente_retorna_200(client: TestClient) -> None:
    criado = client.post("/pedidos", json=_payload_valido()).json()

    response = client.get(f"/pedidos/{criado['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == criado["id"]


def test_get_pedido_inexistente_retorna_404(client: TestClient) -> None:
    response = client.get("/pedidos/999999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Pedido não encontrado."}


# --- GET /pedidos ---------------------------------------------------------------


def test_get_lista_pedidos_vazia(client: TestClient) -> None:
    response = client.get("/pedidos")
    assert response.status_code == 200
    assert response.json() == []


def test_get_lista_pedidos_com_multiplos_registros(client: TestClient) -> None:
    client.post("/pedidos", json=_payload_valido(produto="Hot Dog"))
    client.post("/pedidos", json=_payload_valido(produto="Batata Frita"))

    response = client.get("/pedidos")

    assert response.status_code == 200
    assert len(response.json()) == 2


# --- PATCH /pedidos/{id}/status ---------------------------------------------------


def test_patch_status_existente_atualiza(client: TestClient) -> None:
    criado = client.post("/pedidos", json=_payload_valido()).json()

    response = client.patch(f"/pedidos/{criado['id']}/status", json={"status": "CONFIRMADO"})

    assert response.status_code == 200
    assert response.json()["status"] == "CONFIRMADO"


def test_patch_status_altera_somente_o_status(client: TestClient) -> None:
    criado = client.post("/pedidos", json=_payload_valido()).json()

    atualizado = client.patch(
        f"/pedidos/{criado['id']}/status", json={"status": "CANCELADO"}
    ).json()

    campos_imutaveis = (
        "id",
        "cliente",
        "produto",
        "quantidade",
        "valor_unitario",
        "valor_total",
        "data_criacao",
    )
    for campo in campos_imutaveis:
        assert atualizado[campo] == criado[campo], f"campo {campo} não deveria mudar"
    assert atualizado["status"] == "CANCELADO"


def test_patch_status_pedido_inexistente_retorna_404(client: TestClient) -> None:
    response = client.patch("/pedidos/999999/status", json={"status": "CONFIRMADO"})
    assert response.status_code == 404


def test_patch_status_invalido_retorna_422(client: TestClient) -> None:
    criado = client.post("/pedidos", json=_payload_valido()).json()

    response = client.patch(f"/pedidos/{criado['id']}/status", json={"status": "ENTREGUE"})

    assert response.status_code == 422


def test_patch_status_rejeita_campos_extras(client: TestClient) -> None:
    criado = client.post("/pedidos", json=_payload_valido()).json()

    response = client.patch(
        f"/pedidos/{criado['id']}/status",
        json={"status": "CONFIRMADO", "valor_total": 1},
    )

    assert response.status_code == 422


@pytest.mark.parametrize("pedido_id", ["1e2", "1.5", "+1", "-1", "0", "abc", "NaN", "Infinity"])
def test_get_pedido_rejeita_id_invalido(client: TestClient, pedido_id: str) -> None:
    response = client.get(f"/pedidos/{pedido_id}")
    assert response.status_code == 422


def test_get_pedidos_subrota_inexistente_retorna_404_json(client: TestClient) -> None:
    response = client.get("/pedidos/foo/bar")
    assert response.status_code == 404
    assert response.headers["content-type"].startswith("application/json")


def test_rotas_spa_e_documentacao_desativada(client: TestClient, spa_dist) -> None:
    admin = client.get("/admin/pedidos/1")
    assert admin.status_code == 200
    assert "text/html" in admin.headers["content-type"]

    assert client.get("/docs").status_code == 200
    assert client.get("/redoc").status_code == 404
    assert client.get("/docs/oauth2-redirect").status_code == 404


@pytest.mark.parametrize("path", ["/health/foo", "/openapi.json/foo"])
def test_namespaces_tecnicos_invalidos_retorna_404_json(client: TestClient, path: str) -> None:
    response = client.get(path)
    assert response.status_code == 404
    assert response.headers["content-type"].startswith("application/json")


def test_imagem_do_produto_retorna_jpeg(client: TestClient, spa_dist) -> None:
    response = client.get("/products/combo-hamburguer.jpg")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"
