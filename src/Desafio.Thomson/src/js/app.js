const Request = window.Request
const Headers = window.Headers
const fetch = window.fetch

$('#domain-search').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        $('#btn-search').click();
        return false;
    }
});  

class Api {

  async request (method, url, body) {
    if (body) {
      body = JSON.stringify(body)
    }

    const request = new Request('/api/' + url, {
      method: method,
      body: body,
      credentials: 'same-origin',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    })

    const resp = await fetch(request)
    if (!resp.ok && resp.status !== 400) {
      throw Error(resp.statusText)
    }

    const jsonResult = await resp.json()

    if (resp.status === 400) {
      jsonResult.requestStatus = 400
    }

    return jsonResult
  }

  async getDomain (domainOrIp) {
    return this.request('GET', `domain/${domainOrIp}`)
  }
}

const api = new Api()

function tableFromJson(obj) {

    //debugger
    // the json data. (you can change the values for output.)
    let arrayData = [];
    arrayData.push(obj);

    // Extract value from table header. 
    var col = [];
    for (var i = 0; i < arrayData.length; i++) {
        for (var key in arrayData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // Create a table.
    var table = document.createElement("table");

    // Create table header row using the extracted headers above.
    var tr = table.insertRow(-1);                   // table row.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // table header.
        th.innerHTML = col[i].replace('_', ' ').toUpperCase();
        tr.appendChild(th);
    }

    // add json data to the table as rows.
    for (var i = 0; i < arrayData.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = arrayData[i][col[j]];
        }
    }

    // Now, add the newly created table with json data, to a container.
    var divShowData = document.getElementById('whois-results');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);

    return divShowData
}

function cleanForm() {

    $('#txt-search-error').remove();

    let whois = document.getElementById('whois-results');
    let txtSearch = document.getElementById('txt-search');

    whois.innerHTML = '';
    txtSearch.value = '';
    txtSearch.classList.remove('success-alert');

    txtSearch.focus();
}

var submitFunc = async () => {

    $('[name="btn-search"]').text('Carregando...')

    const txt = document.getElementById('txt-search')

    const response = await api.getDomain(txt.value)

    if (response) {
        //console.log(response);

        if (response.iP_Registro)
            tableFromJson(response);
        else {
            cleanForm();
            $.notify("Dominio invalido!");
        }

        $('[name="btn-search"]').text('Pesquisar')
    }
}

var callback = () => {
  const btn = document.getElementById('btn-search')

  if (btn) {
      btn.onclick = async () => {

          jQuery.validator.addMethod('twitteruserrequired', function (value, element, isactive) {
              return ($('#txt-search').val() != 'ok');
          }, "Teste value");

          $('[name="form-search"]').validate({
            errorClass: "error fail-alert",
            validClass: "valid success-alert",
            rules: {
                'txt-search': {
                    required: true,
                    twitteruserrequired: true
                }
            },
            messages: {
                'txt-search': {
                    required: "Por favor insira um valor de dominio para prosseguir"
                }
            },
            submitHandler: function (form) {
                submitFunc();
            }
        });

        $('[name="form-search"]').submit();
    }
  }
}

document.getElementById('btn-clean').onclick = async () => {
    cleanForm()
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  callback()
} else {
  document.addEventListener('DOMContentLoaded', callback)
}
