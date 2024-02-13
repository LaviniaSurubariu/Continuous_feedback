import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip } from 'chart.js';

import { setChartData } from './store/slices/globalSlice';
import { useDispatch, useSelector } from 'react-redux';


Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip);

let interval = 1000;

function FeedbackChart() {
    const [data, setData] = useState(null);
    const { chartData } = useSelector((state) => state.global);
    const dispatch = useDispatch();
    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#333',
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: true
                }
            }
        },
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    beginAtZero: true
                }
            }
        }
    };
    try {
        useEffect(() => {

            const fetchData = async () => {


                const options = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };
                const response = await fetch(`${process.env.REACT_APP_API_URL}/activities/${chartData.activity.id}/feedbacks`, options);
                const data = await response.json();

                if (data.success && data.message === "Activities list for user" && data.data !== chartData) {
                    dispatch(setChartData(data.data))

                } else {
                    alert('Activity not found!');
                }

                const durationParts = chartData.activity.duration.split(':');
                const durationInSeconds = Number(durationParts[0]) * 3600 + Number(durationParts[1]) * 60 + Number(durationParts[2]);

                const durationMinutes = durationInSeconds / 60;

                const reactions = {
                    frowny: [],
                    smiley: [],
                    surprised: [],
                    confused: []
                };

                let startDate = new Date(chartData.activity.date)
                const labels = [];
                for (let i = 0; i <= Math.ceil(durationMinutes / 5) * 5; i += 5) {
                    labels.push(i);
                    reactions.smiley.push(chartData.smiley.map(el => (new Date(el.time) - startDate) / (60000)).filter(el => i <= el && el <= (i + 5)).length)
                    reactions.frowny.push(chartData.frowny.map(el => (new Date(el.time) - startDate) / (60000)).filter(el => i <= el && el <= (i + 5)).length)
                    reactions.surprised.push(chartData.surprised.map(el => (new Date(el.time) - startDate) / (60000)).filter(el => i <= el && el <= (i + 5)).length)
                    reactions.confused.push(chartData.confused.map(el => (new Date(el.time) - startDate) / (60000)).filter(el => i <= el && el <= (i + 5)).length)
                }

                const colors = [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',

                ];
                const chart = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'frowny',
                            data: reactions.frowny,
                            borderColor: colors[1 % colors.length],
                            fill: false

                        },
                        {
                            label: 'smiley',
                            data: reactions.smiley,
                            borderColor: colors[2 % colors.length],
                            fill: false

                        },
                        {
                            label: 'confused',
                            data: reactions.confused,
                            borderColor: colors[3 % colors.length],
                            fill: false

                        },
                        {
                            label: 'surprised',
                            data: reactions.surprised,
                            borderColor: colors[4 % colors.length],
                            fill: false

                        }],
                };


                setData(chart);
                interval += 1000

            }

            fetchData();
            const intervalId = setInterval(fetchData, interval);
            return () => clearInterval(intervalId);

        }, [chartData])
    } catch (e) { return <div>Loading...</div>; }

    if (!data) {
        return <div>Loading...</div>;
    }

    return <Line data={data} options={options} />;
}

export default FeedbackChart;
