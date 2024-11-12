import { Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{`${label}`}</div>
        <div>
          {payload.map((pld) => (
            <div>
              <div style={{ color: pld.color }}>
                {pld.dataKey}: {pld.value}
              </div>
              <div style={{ color: pld.color }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default CustomTooltip;