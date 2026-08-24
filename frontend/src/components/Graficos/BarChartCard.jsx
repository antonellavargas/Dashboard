import { Bar } from "react-chartjs-2";

function BarChartCard({
  title,
  labels,
  values
}) {

  return (

    <div className="bg-white p-6 rounded-3xl shadow">

      <h2 className="font-bold mb-4">
        {title}
      </h2>

      <div className="h-[300px]">

        <Bar
          data={{
            labels,
            datasets: [
              {
                data: values
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />

      </div>

    </div>

  );
}

export default BarChartCard;