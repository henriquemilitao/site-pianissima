// Pix da entrada avulsa, mostrado ao escolher "Pagar agora" no formulário de avulso.
// O QR (public/pix-avulso.svg) é estático e sem valor: abre a chave no app do banco e a pessoa digita o valor.
// Conteúdo do QR (Pix copia e cola), conferido lendo a imagem de volta:
// 00020126360014br.gov.bcb.pix0114+55679810479955204000053039865802BR5910PIANISSIMA6012CAMPO GRANDE62070503***6304607B

export const PIX = {
  qr: '/pix-avulso.svg',
  chave: '(67) 98104-7995', // celular
  valorAvulso: 100, // R$ por pessoa
}
