import { defineComponent, h, computed } from 'vue'
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
  name: 'MerchantTrackerChart',
  props: {
    merchantTrackerData: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      default: 250
    }
  },
  setup(props) {
    const chartData = computed(() => {
      if (!props.merchantTrackerData || !props.merchantTrackerData.xAxis) {
        return { labels: [], datasets: [] };
      }

      const colors = [
        '#61116a', // WIP Lead
        '#f59e0b', // Data Entry Pending
        '#2563eb', // Submitted to Mars
        '#10b981', // Implemented
        '#64748b'  // Finance Pending
      ];

      return {
        labels: props.merchantTrackerData.xAxis.categories,
        datasets: props.merchantTrackerData.series.map((s, i) => ({
          label: s.name,
          data: s.data,
          backgroundColor: colors[i % colors.length],
          borderRadius: 4,
          barThickness: 15
        }))
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { family: 'Inter', size: 10, weight: '600' }
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { display: false } },
        y: { stacked: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } }
      }
    }

    return () =>
      h(Bar, {
        data: chartData.value,
        options: chartOptions,
        height: props.height
      })
  }
})
