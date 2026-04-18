import { defineComponent, h, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { useStore } from 'vuex'
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
  name: 'AgingTrackerChart',
  props: {
    height: {
      type: Number,
      default: 350
    }
  },
  setup(props) {
    const store = useStore()

    const agingData = computed(() => store.getters['SAT_Dashboard/getSatDashboardAgingGraphData'])

    onMounted(() => {
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_AGING_CHART_DATA', {
        region: userInfo.region.id,
      })
    })

    const chartData = computed(() => {
      if (!agingData.value || !agingData.value.xAxis) return { labels: [], datasets: [] };

      // Modern Palette for the datasets
      const colors = [
        { bg: 'rgba(97, 17, 106, 0.8)', border: '#61116a' }, // Primary Purple
        { bg: 'rgba(37, 99, 235, 0.8)', border: '#2563eb' }, // Blue
        { bg: 'rgba(245, 158, 11, 0.8)', border: '#f59e0b' }  // Amber
      ]

      const datasets = agingData.value.series.map((s, i) => ({
        label: s.name,
        data: s.data,
        backgroundColor: colors[i % colors.length].bg,
        borderColor: colors[i % colors.length].border,
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 20,
        maxBarThickness: 30
      }))

      return {
        labels: agingData.value.xAxis.categories,
        datasets: datasets
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: { family: 'Inter', size: 12, weight: '600' },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          titleFont: { family: 'Inter', size: 14, weight: '700' },
          bodyFont: { family: 'Inter', size: 13 },
          cornerRadius: 8,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8', padding: 10 }
        }
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
