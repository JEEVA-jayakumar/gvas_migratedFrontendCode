import { h, defineComponent } from 'vue'
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
  name: 'ChartDailyVolume',
  props: {
    chartId: { type: String, default: 'bar-chart' },
    datasetIdKey: { type: String, default: 'label' },
    width: { type: Number, default: 400 },
    height: { type: Number, default: 150 },
    cssClasses: { type: String, default: '' },
    styles: { type: Object, default: () => ({}) },
    plugins: { type: Array, default: () => [] }
  },
  setup(props) {
    const chartData = {
      labels: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      datasets: [{
        label: 'Volume',
        backgroundColor: "rgb(156, 156, 156)",
        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
      }]
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }

    return () =>
      h(Bar, {
        chartData,
        chartOptions,
        chartId: props.chartId,
        datasetIdKey: props.datasetIdKey,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins
      })
  }
})
