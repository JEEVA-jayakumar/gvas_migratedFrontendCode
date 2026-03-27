import { defineComponent, h, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
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
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: 150
    }
  },
  setup(props) {
    const store = useStore()
    const $q = useQuasar()

    const agingData = computed(() => store.getters['SAT_Dashboard/getSatDashboardAgingGraphData'])

    const loadAgingGraphData = () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });

      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_AGING_CHART_DATA', {
        region: userInfo.region.id,
      }).then(() => {
        $q.loading.hide();
      }).catch(() => {
        $q.loading.hide();
      });
    }

    onMounted(() => {
      loadAgingGraphData();
    })

    const chartData = computed(() => {
      if (!agingData.value || !agingData.value.xAxis) return { labels: [], datasets: [] };
      return {
        labels: agingData.value.xAxis.categories,
        datasets: agingData.value.series
      }
    })

    const chartOptions = computed(() => {
      if (!agingData.value || !agingData.value.yAxis) return { responsive: true, maintainAspectRatio: false };
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: agingData.value.yAxis.title.text
            }
          }
        }
      }
    })

    return () =>
      h(Bar, {
        data: chartData.value,
        options: chartOptions.value,
        height: props.height
      })
  }
})
