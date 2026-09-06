import { describe, expect, it } from "vitest";
import { parsePedidoId } from "./pedido-id";

describe("parsePedidoId", () => {
  it.each(["1", "42", "9007199254740991"])("aceita %s", (value) => {
    expect(parsePedidoId(value)).toBe(Number(value));
  });

  it.each(["", " ", "1e2", "1.5", "+1", "-1", "0", "abc", "NaN", "Infinity", "9007199254740992"])(
    "rejeita %s",
    (value) => {
      expect(parsePedidoId(value)).toBeNull();
    },
  );

  it("aceita somente números inteiros seguros quando a entrada já é numérica", () => {
    expect(parsePedidoId(7)).toBe(7);
    expect(parsePedidoId(1.5)).toBeNull();
    expect(parsePedidoId(Number.MAX_SAFE_INTEGER + 1)).toBeNull();
  });
});
