/*!
 * Copyright (c) 2023 Mediasoft & Cie S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Example DataFrame creation
  df = new DataFrame([
    { year: 2018, value: 10 },
    { year: 2019, value: 15 },
    { year: 2020, value: 20 },
    { year: 2021, value: 25 }
]);

// Extracting data for the chart
const years = df.getColumn('year');
const values = df.getColumn('value');

// Select the canvas element and create the chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: years,
        datasets: [{
            label: 'Yearly Value',
            data: values,
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
