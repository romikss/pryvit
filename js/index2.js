let lang = 'English'; //Ukrainian

function changeLang(newLang) {
    lang = newLang;
    localStorage.setItem('lang', newLang);
    fetchPledges(0).then(result => {
        renderPledges(result);
    });
}

function fetchPledges(pageIdx) {

    let qryStr = `%7BLanguage%7D%3D'${lang}'`; //filter by selected lang
    qryStr += '&sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc';  //sort by id desc

    return fetch(`https://api.airtable.com/v0/appodNTtY8v2Dnsjb/Table%201?filterByFormula=${qryStr}`, {
        headers: {
          'Authorization': 'Bearer keyMLcEdCNp7GO3Is'
        }
      }).then((response) => response.json());
}

function searchPledges() {

    const qryStr = document.getElementById('pledgeSearchInput').value.toLowerCase();
    const qryParam = `OR(FIND(%22${qryStr}%22%2C+LOWER(%7BPledge+Title%7D))%2C+FIND(%22${qryStr}%22%2C+LOWER(%7BPledge+Description%7D))%2C+FIND(%22${qryStr}%22%2C+LOWER(%7BCompany+Name%7D)))`; 
    
    fetch(`https://api.airtable.com/v0/appodNTtY8v2Dnsjb/Table%201?filterByFormula=${qryParam}`, {
        headers: {
          'Authorization': 'Bearer keyMLcEdCNp7GO3Is'
        }
      }).then((response) => response.json()).then(
          filteredResults => {
              renderPledges(filteredResults);
          }
      );
}


window.onload = function() {

    lang = localStorage.getItem('lang') || 'English';

    fetchPledges(0).then(result => {
        console.log(result);
        renderPledges(result);
    });

};

function renderPledges(airTableResponse) {

    const pledgeWrapper = document.getElementById('company-pledge-wrapper');
    pledgeWrapper.innerHTML = '';

    airTableResponse.records.forEach(record => {
        
        const logo = record.fields['Company Logo'] ? record.fields['Company Logo'][0].url: 'no-image.png';
        const pledge = document.createElement("div");
        pledge.classList.add('col-lg-4');
        pledge.innerHTML = `   
            <div class="card mb-5">
                <img class="card-img img-fluid" src="${logo}" alt="Company Logo" style="height:240px !important; object-fit:cover;">
                <div class="card-body d-flex flex-column pledge-card-content">
                <h3 class="card-title mb-4">${record.fields['Company Name']}</h3>
                <h5 class="card-subtitle">${record.fields['Pledge Title']}</h5>
                <p class="card-text">${record.fields['Pledge Description']}</p>
                <h5 class="card-subtitle">How to Avail</h5>
                <p class="card-text">${record.fields['How to Avail']}</p>
                <h5 class="card-subtitle">Contact Name</h5>
                <p class="card-text">${record.fields['Contact Name']}</p>
                <h5 class="card-subtitle">Contact Email</h5>
                <p class="card-text">${record.fields['Email Address']}</p>
                <h5 class="card-subtitle">Contact Phone</h5>
                <p class="card-text">${record.fields['Phone Number']}</p>
                </div>
            </div>
        `;
        
        pledgeWrapper.appendChild(pledge);    
    });
} 


