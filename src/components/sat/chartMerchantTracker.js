import { defineComponent, h } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'BarChart',
  props: {
    merchantTrackerData: {
      type: Object,
      required: true
    },
    borderWidth: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const labels = props.merchantTrackerData.xAxis.categories;
    const datasets = props.merchantTrackerData.series;
    const yAxisLabel = props.merchantTrackerData.yAxis.title.text;

    const chartData = {
      labels: labels,
      datasets: datasets
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: yAxisLabel
          }
        }
      }
    }

    return () =>
      h(Bar, {
        data: chartData,
        options: chartOptions
      })
  }
})
