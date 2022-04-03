let pledgeTitles;

function bodyLoaded(lang) {
    
    pledgeTitles = getTitles(lang);

    fetchPledges(lang).then(result => {
        renderPledges(result);
    });
}

function fetchPledges(lang) {

    let qryStr = `%7BLanguage%7D%3D'${lang}'`; //filter by selected lang
    qryStr += '&sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc';  //sort by id desc

    return fetch(`https://api.airtable.com/v0/appodNTtY8v2Dnsjb/Table%201?filterByFormula=${qryStr}`, {
        headers: {
            'Authorization': 'Bearer keyAWZupPG1S51PoD' //this is a read-only key, please dont abuse this site :(
        }
      }).then((response) => response.json());
}

function searchPledges() {

    const qryStr = document.getElementById('pledgeSearchInput').value.toLowerCase();
    const qryParam = `OR(FIND(%22${qryStr}%22%2C+LOWER(%7BPledge+Title%7D))%2C+FIND(%22${qryStr}%22%2C+LOWER(%7BPledge+Description%7D))%2C+FIND(%22${qryStr}%22%2C+LOWER(%7BCompany+Name%7D)))`; 
    
    fetch(`https://api.airtable.com/v0/appodNTtY8v2Dnsjb/Table%201?filterByFormula=${qryParam}`, {
        headers: {
            'Authorization': 'Bearer keyAWZupPG1S51PoD' //this is a read-only key, please dont abuse this site :(
        }
      }).then((response) => response.json()).then(
          filteredResults => {
              renderPledges(filteredResults);
          }
      );
}


function renderPledges(airTableResponse) {
    
    const pledgeWrapper = document.getElementById('company-pledge-wrapper');
    pledgeWrapper.innerHTML = '';

    airTableResponse.records.forEach(record => {
        
        const logo = record.fields['Company Logo'] ? record.fields['Company Logo'][0].url: 'images/no-image.png';
        let website = record.fields['Website'];
        if(website) {
            if(website.substring(0,4) !== 'http') {
                website = 'https://' + website;
            }
        }
        const pledge = document.createElement("div");
        pledge.classList.add('col-lg-4');
        pledge.innerHTML = `   
            <div class="card mb-5">
                <img class="card-img img-fluid" src="${logo}" alt="Company Logo" style="height:240px !important; object-fit:cover;">
                <div class="card-body d-flex flex-column pledge-card-content">
                <h3 class="card-title mb-4">${record.fields['Company Name']}</h3>
                <h5 class="card-subtitle">${record.fields['Pledge Title']}</h5>
                <p class="card-text">${record.fields['Pledge Description']}</p>
                <h5 class="card-subtitle">${pledgeTitles.avail}</h5>
                <p class="card-text">${record.fields['How to Avail']}</p>
                <h5 class="card-subtitle">${pledgeTitles.address}</h5>
                <p class="card-text">${record.fields['Address']}</p>
                <h5 class="card-subtitle">${pledgeTitles.name}</h5>
                <p class="card-text">${record.fields['Contact Name']}</p>
                <h5 class="card-subtitle">${pledgeTitles.email}</h5>
                <p class="card-text">${record.fields['Email Address']}</p>
                <h5 class="card-subtitle">${pledgeTitles.phone}</h5>
                <p class="card-text">${record.fields['Phone Number']}</p>
                <h5 class="card-subtitle">${pledgeTitles.site}</h5>
                <p class="card-text"><a href="${website}">${website}</a></p>
                </div>
            </div>
        `;
        
        pledgeWrapper.appendChild(pledge);    
    });
} 

function getTitles(lang) {

    let titles;
    
    if(lang === 'English') {
        titles = {
            avail: 'How to Avail',
            address: 'Address',
            site: 'Website',
            name: 'Contact Name',
            email: 'Contact Email',
            phone: 'Contact Phone'
        }
    }
    else {
        titles = {
            avail: 'Як скористатися пропозицією',
            address: 'адреса',
            site: 'веб-сай',
            name: 'Контактна Особа',
            email: 'Електронна адреса',
            phone: 'Номер телефону'
        }
    }
    return titles;
}




