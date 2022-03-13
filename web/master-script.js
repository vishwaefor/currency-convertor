(async () => {
  let tableObj;
  tableObj = await calcData();

  $('#calcbutton').on('click', () => {
    calcData();
  });

  async function calcData() {
    const inputElementAmount = document.getElementById('amount-input');
    const inputElementCurrency = document.getElementById('currency-input');

    const response = await fetch(
      `/api/graph?amount=${inputElementAmount.value}&currency=${inputElementCurrency.value}`
    );
    const dataSet = await response.json();
    if (tableObj && tableObj !== null) {
      tableObj.clear();
      tableObj.destroy();
    }

    tableObj = $('#datatable').DataTable({
      data: dataSet,
      Headers: true,
      columns: [
        { title: 'Currency Code', data: 'Currency Code' },
        { title: 'Country', data: 'Country' },
        { title: 'Amount of currency', data: 'Amount of currency' },
        {
          title: 'Path for the best conversion rate',
          data: 'Path for the best conversion rate',
        },
      ],
    });

    return tableObj;
  }
})();
