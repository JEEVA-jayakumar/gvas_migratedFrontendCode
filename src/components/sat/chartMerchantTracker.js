import { h, defineComponent, watch } from 'vue'
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
  name: 'ChartMerchantTracker',
  props: {
    merchantTrackerData: { type: Object, required: true },
    chartId: { type: String, default: 'bar-chart' },
    width: { type: Number, default: 400 },
    height: { type: Number, default: 150 },
  },
  setup(props) {
    const getChartData = () => {
      if (!props.merchantTrackerData || !props.merchantTrackerData.xAxis) {
        return { labels: [], datasets: [] }
      }
      return {
        labels: props.merchantTrackerData.xAxis.categories,
        datasets: props.merchantTrackerData.series.map(s => ({
          ...s,
          backgroundColor: s.color || '#61116a'
        }))
      }
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: props.merchantTrackerData?.yAxis?.title?.text || ''
          }
        }
      }
    }

    return () =>
      h(Bar, {
        chartData: getChartData(),
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height
      })
  }
})
