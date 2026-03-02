import { h, defineComponent, onMounted, computed } from 'vue'
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
  name: 'ChartSATagingTracker',
  props: {
    chartId: { type: String, default: 'bar-chart' },
    width: { type: Number, default: 400 },
    height: { type: Number, default: 150 },
  },
  setup(props) {
    const store = useStore()
    const $q = useQuasar()

    const getSatDashboardAgingGraphData = computed(() => store.getters['SAT_Dashboard/getSatDashboardAgingGraphData'])

    const loadAgingGraphData = () => {
      const userInfo = localStorage.getItem("u_i");
      if (!userInfo) return;

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_AGING_CHART_DATA', {
        region: JSON.parse(userInfo).region.id
      }).finally(() => {
        $q.loading.hide();
      });
    }

    onMounted(() => {
      loadAgingGraphData();
    })

    const chartData = computed(() => {
      const data = getSatDashboardAgingGraphData.value;
      if (!data || !data.xAxis) {
        return { labels: [], datasets: [] }
      }
      return {
        labels: data.xAxis.categories,
        datasets: data.series.map(s => ({
          ...s,
          backgroundColor: s.color || '#61116a'
        }))
      }
    })

    const chartOptions = computed(() => {
      const data = getSatDashboardAgingGraphData.value;
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: data?.yAxis?.title?.text || ''
            }
          }
        }
      }
    })

    return () =>
      h(Bar, {
        chartData: chartData.value,
        chartOptions: chartOptions.value,
        chartId: props.chartId,
        width: props.width,
        height: props.height
      })
  }
})
