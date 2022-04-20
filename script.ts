interface Veiculo {
  nome: string
  placa: string
  entrada: Date | string
}

;(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query)

  function calcTempo(mil: number): String {
    const min = Math.floor(mil / 60000)
    const sec = Math.floor((mil % 60000) / 1000)
    return `${min} minutos e ${sec} segundos`
  }

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : []
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem('patio', JSON.stringify(veiculos))
    }

    function render() {
      $('#patio')!.innerHTML = ''
      const patio = ler()

      if (patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo))
      }
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement('tr')
      row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
      <button class="delete" data-placa="${veiculo.placa}">X</button>
      </td>
      `

      row.querySelector('.delete')?.addEventListener('click', function () {
        remover(this.dataset.placa as string)
      })

      $('#patio')?.appendChild(row)

      if (salva) salvar([...ler(), veiculo])
    }

    function remover(placa: string) {
      const veiculo = ler().find((veic) => veic.placa === placa)
      const tempo = calcTempo(
        new Date().getTime() - new Date(veiculo.entrada).getTime()
      )

      if (
        !confirm(
          `O veículo ${veiculo.nome} permaneceu por ${tempo}. Deseja encerrar?`
        )
      )
        return

      salvar(ler().filter((veic) => veic.placa !== placa))
      render()
    }

    return { ler, adicionar, remover, salvar, render }
  }

  patio().render()
  $('#cadastrar')?.addEventListener('click', () => {
    const nome = $('#nome')?.value
    const placa = $('#placa')?.value

    if (!nome || !placa) {
      alert('Nome e placa são obrigatórios')
      return
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true)
  })
})()
