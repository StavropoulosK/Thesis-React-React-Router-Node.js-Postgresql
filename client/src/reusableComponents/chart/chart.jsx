import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './Chart.css';

import { useTranslation } from "react-i18next";


ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin to draw text in center
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.restore();
    const fontSize = (height / 130).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = 'middle';

    const text = chart.config.options.plugins.centerText.text;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2 - 25;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};


const Chart = ({ dataValues = [], labels = [], centerText, description,unit="" }) => {

    
    // Plugin to draw separate values on the chart
    const valueLabelPlugin = {
        id: 'valueLabel',
        afterDatasetDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const dataset = chart.data.datasets[0];
    
        ctx.save();
        meta.data.forEach((element, index) => {
            const dataValue = dataset.data[index];
            const position = element.tooltipPosition();
    
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(` ${dataValue}${unit}`, position.x, position.y);
        });
        ctx.restore();
        }
    };

    const chartData = {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: [
            '#11B3BB', // Teal
            '#00802b', // Light Green
            '#ac00e6', // Light Blue
            '#99003d', // Light Purple
            '#808000', // Light Gold
          ],          
          borderWidth: 0,
        },
      ],
    };
  
    const options = {
        responsive: true,
        maintainAspectRatio: false, // allows stretching inside fixed-size container
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${unit}${context.formattedValue}`,
            },
          },
          centerText: {
            text: centerText,
          },
        },
      };
  
    return (
        <div className="chart-wrapper">
            <div className="chart-fixed-size">
                <Doughnut
                    data={chartData}
                    options={options}
                    plugins={[centerTextPlugin, valueLabelPlugin]}
                />
            </div>
        <div className="data-note">{description}</div>
      </div>
    );
  };

  
export default Chart;
