import { listProducts, registerIntent, makePurchase } from "../controllers/tools.js";

console.log("=== 1. TESTANDO LISTAR CATALOGO ===");
console.log(listProducts());

console.log("\n=== 2. TESTANDO REGISTRAR INTENÇÃO (Fone Bluetooth - R$ 249.90) ===");
const intencaoSucesso = registerIntent("user_1", "prod_003", 1);
console.log("Intenção criada:", intencaoSucesso);

console.log("\n=== 3. TESTANDO COMPRA COM SUCESSO (PIX) ===");
const compraSucesso = makePurchase("user_1", intencaoSucesso.intencao_id, "pix");
console.log("Resultado da compra:", compraSucesso);

console.log("\n=== 4. TESTANDO ERRO: INTENÇÃO JÁ PAGA ===");
const compraRepetida = makePurchase("user_1", intencaoSucesso.intencao_id, "cartao");
console.log("Resultado esperado (INTENCAO_JA_PAGA):", compraRepetida);

console.log("\n=== 5. TESTANDO ERRO: LIMITE EXCEDIDO ===");
const intencaoCara = registerIntent("user_1", "prod_002", 1);
const compraSemLimite = makePurchase("user_1", intencaoCara.intencao_id, "cartao");
console.log("Resultado esperado (LIMITE_EXCEDIDO):", compraSemLimite);

console.log("\n=== 6. TESTANDO ERRO: INTENÇÃO INVÁLIDA (ID FALSO) ===");
const compraIdFalso = makePurchase("user_1", "int_falsa_123", "pix");
console.log("Resultado esperado (INTENCAO_INVALIDA):", compraIdFalso);