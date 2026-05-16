/**
 * Simula un hash SHA-256 real (0x + 64 caracteres hexadecimales)
 * @param {string} text - Texto a hashear
 * @returns {Promise<string>} - Hash hexadecimal que parece real
 */
export async function simulateSha256(text) {
  try {
    // Usamos el Web Crypto API real para generar un verdadero SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return "0x" + hashHex;
  } catch (error) {
    console.error("Error generando SHA-256:", error);
    // Fallback: generar un hash fake si falla (nunca debería)
    return generateFakeHash();
  }
}

/**
 * Genera un hash simulado que se ve como un real
 * @returns {string} - Hash fake (0x + 64 caracteres hex)
 */
function generateFakeHash() {
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  return hash;
}

/**
 * Simula una transacción en blockchain (sin conectar a red real)
 * Retorna un hash de transacción fake pero realista
 * @param {string} documentHash - Hash del documento
 * @param {string} address - Dirección de la wallet
 * @returns {Promise<Object>} - Objeto simulando respuesta de blockchain
 */
export async function simulateBlockchainTransaction(documentHash, address) {
  if (!address) {
    throw new Error("Wallet no conectada");
  }

  // Simula latencia de red (200-800ms)
  const delay = Math.random() * 600 + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Genera un hash de transacción fake
  const txHash = "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

  // Simula un bloque en la blockchain
  const blockNumber = Math.floor(Math.random() * 50000000) + 35000000;
  const timestamp = Math.floor(Date.now() / 1000);

  return {
    transactionHash: txHash,
    hash: txHash,
    blockNumber: blockNumber,
    timestamp: timestamp,
    from: address,
    to: "0x1234567890123456789012345678901234567890", // Dirección fake del contrato
    status: "success",
    gasUsed: Math.floor(Math.random() * 100000) + 50000,
  };
}

/**
 * Simula conectar una wallet (instantáneo)
 * @returns {string} - Dirección de wallet fake pero realista
 */
export function simulateWalletConnect() {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}
