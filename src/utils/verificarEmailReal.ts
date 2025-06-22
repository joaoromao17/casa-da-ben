
export async function verificarEmailReal(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `http://apilayer.net/api/check?access_key=ee5c6e9beae86c9c83973b84176b5d88&email=${email}&smtp=1&format=1`
    );
    const data = await response.json();

    // Aceita se o formato é válido e não é descartável (mesmo que smtp_check falhe)
    return data.format_valid && !data.disposable;
  } catch (error) {
    console.warn("❌ Erro ao verificar e-mail com Mailboxlayer:", error);
    return true; // Não bloqueia se a API falhar
  }
}
