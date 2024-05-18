document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    document.getElementById('affected-link').addEventListener('click', () => loadAffectedPage());
    document.getElementById('vaccinated-link').addEventListener('click', () => loadVaccinatedPage());
    document.getElementById('neighbors-link').addEventListener('click', () => loadNeighborsPage());

    function loadAffectedPage() {
        content.innerHTML = `
            <h2>Affected Cases</h2>
            <select id="country-select"></select>
            <div class="chart-container">
                <canvas id="affected-chart"></canvas>
            </div>
        `;
        fetchCountries().then(countries => populateCountryDropdown(countries, 'country-select', fetchAffectedData));
    }

    function loadVaccinatedPage() {
        content.innerHTML = `
            <h2>Vaccinated People</h2>
            <select id="country-select"></select>
            <div class="chart-container">
                <canvas id="vaccinated-chart"></canvas>
            </div>
        `;
        fetchCountries().then(countries => populateCountryDropdown(countries, 'country-select', fetchVaccinatedData));
    }

    function loadNeighborsPage() {
        content.innerHTML = `
            <h2>Neighboring Countries</h2>
            <table>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Cases</th>
                        <th>Deaths</th>
                        <th>Recoveries</th>
                        <th>Vaccinations</th>
                    </tr>
                </thead>
                <tbody id="neighbors-table-body"></tbody>
            </table>
        `;
        fetchNeighboringData();
    }

    function fetchCountries() {
        return fetch('https://disease.sh/v3/covid-19/countries')
            .then(response => response.json());
    }

    function populateCountryDropdown(countries, selectId, dataFetchFunction) {
        const select = document.getElementById(selectId);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.countryInfo.iso2;
            option.textContent = country.country;
            select.appendChild(option);
        });

        select.addEventListener('change', (event) => {
            dataFetchFunction(event.target.value);
        });

        dataFetchFunction(select.value); 
    }

    function fetchAffectedData(countryCode) {
        fetch(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=30`)
            .then(response => response.json())
            .then(data => {
                const dates = Object.keys(data.timeline.cases);
                const cases = Object.values(data.timeline.cases);
                const deaths = Object.values(data.timeline.deaths);
                const recoveries = Object.values(data.timeline.recovered);
                renderLineChart('affected-chart', dates, cases, deaths, recoveries);
            });
    }

    function fetchVaccinatedData(countryCode) {
        fetch(`https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=30`)
            .then(response => response.json())
            .then(data => {
                const dates = Object.keys(data.timeline);
                const vaccinations = Object.values(data.timeline);
                renderVaccinationChart('vaccinated-chart', dates, vaccinations);
            });
    }

    function fetchNeighboringData() {
        const countries = ['India', 'Sri Lanka', 'Bangladesh', 'China', 'Nepal'];
        const promises = countries.map(country =>
            fetch(`https://disease.sh/v3/covid-19/countries/${country}`).then(response => response.json())
        );

        Promise.all(promises).then(data => {
            const tableBody = document.getElementById('neighbors-table-body');
            tableBody.innerHTML = '';
            data.forEach(countryData => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${countryData.country}</td>
                    <td>${countryData.cases}</td>
                    <td>${countryData.deaths}</td>
                    <td>${countryData.recovered}</td>
                    <td>${countryData.vaccinated}</td>
                `;
                tableBody.appendChild(row);
            });
        });
    }

    function renderLineChart(canvasId, labels, cases, deaths, recoveries) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Cases',
                        data: cases,
                        borderColor: 'blue',
                        fill: false,
                    },
                    {
                        label: 'Deaths',
                        data: deaths,
                        borderColor: 'red',
                        fill: false,
                    },
                    {
                        label: 'Recoveries',
                        data: recoveries,
                        borderColor: 'green',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Count',
                        },
                    },
                },
            },
        });
    }

    function renderVaccinationChart(canvasId, labels, vaccinations) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Vaccinations',
                        data: vaccinations,
                        borderColor: 'purple',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Count',
                        },
                    },
                },
            },
        });
    }

    
    loadAffectedPage();
});
