import React from "react";
import "./App.css";

//Pearson's Correlation Coefficient
function CalculatePCC({ data, setDataForDisplay }) {
  //Round number to the decimal place (1.2) instead of 1.222232222
  function roundToDecimal(number, places) {
    return (Math.round(number * 100) / 100).toFixed(places);
  }
  //Calculate X bar (X mean) and Y bar (Y mean)
  function calculateMeansXY() {
    let meanX = 0,
      meanY = 0;
    data.x.map((item) => {
      meanX = meanX + parseInt(item);
    });
    data.y.map((item) => {
      meanY = meanY + parseInt(item);
    });
    // console.log("meanX= ", meanX);
    // console.log("meanY= ", meanY);
    meanX = meanX / data.x.length;
    meanY = meanY / data.y.length;
    // console.log("meanX / length= ", meanX);
    // console.log("meanY / length= ", meanY);
    const result = { meanX: meanX, meanY: meanY };
    return result;
  }
  const meanXY = calculateMeansXY();
  //Calculate (x-xBAR) and (y-yBAR)
  function calculateXminusXbar(meanXY) {
    const meanX = meanXY.meanX;
    const meanY = meanXY.meanY;
    //Calculate XminusXbar and XminusXbarSquare (x-xbar) (xminusxbarsquare)
    const XminusXbar = [];
    const XminusXbarSquare = [];
    data.x.map((item, i) => {
      XminusXbar.push(roundToDecimal(item - meanX, 1));
      XminusXbarSquare.push(roundToDecimal(XminusXbar[i] * XminusXbar[i], 2));
    });

    const YminusYbar = [];
    const YminusYbarSquare = [];
    data.y.map((item, i) => {
      YminusYbar.push(roundToDecimal(item - meanY, 1));
      YminusYbarSquare.push(roundToDecimal(YminusYbar[i] * YminusYbar[i], 2));
    });

    //Calculate (XminusXbar) * (YminusYbar)
    const multiplyXminusXbarYminusYbar = [];
    XminusXbar.map((Xbar, i) => {
      const Ybar = YminusYbar[i];
      multiplyXminusXbarYminusYbar.push(roundToDecimal(Xbar * Ybar, 2));
    });

    const result = {
      XminusXbarSquare: XminusXbarSquare,
      YminusYbarSquare: YminusYbarSquare,
      XminusXbar: XminusXbar,
      YminusYbar: YminusYbar,
      multiplyXminusXbarYminusYbar: multiplyXminusXbarYminusYbar,
    };
    return result;
  }
  const dataFromSquareCalculations = calculateXminusXbar(meanXY);
  //Calculate Sum of multiplyXminusXbarYminusYbar
  function SumOfMultiplyXYbar(dataFromSquareCalculations) {
    let sumOfMultiplyXYbar = 0;
    const multiplied = dataFromSquareCalculations.multiplyXminusXbarYminusYbar;
    multiplied.map((XYbar) => {
      return (sumOfMultiplyXYbar = sumOfMultiplyXYbar + parseFloat(XYbar));
    });
    //Calculate XminusXbarSQUARE SUM
    let sumOfXminusXbarSquare = 0;
    dataFromSquareCalculations.XminusXbarSquare.map((XbarSquare) => {
      return (sumOfXminusXbarSquare =
        sumOfXminusXbarSquare + parseFloat(XbarSquare));
    });
    //Calculate YminusYbarSQUARE SUM
    let sumOfYminusYbarSquare = 0;
    dataFromSquareCalculations.YminusYbarSquare.map((YbarSquare) => {
      return (sumOfYminusYbarSquare =
        sumOfYminusYbarSquare + parseFloat(YbarSquare));
    });

    const result = {
      sumOfMultiplyXYbar: roundToDecimal(sumOfMultiplyXYbar, 2),
      sumOfXminusXbarSquare: roundToDecimal(sumOfXminusXbarSquare, 2),
      sumOfYminusYbarSquare: roundToDecimal(sumOfYminusYbarSquare, 2),
    };
    return result;
  }
  const dataFromSums = SumOfMultiplyXYbar(dataFromSquareCalculations);

  function calculateCoef(dataFromSums) {
    const result =
      parseFloat(dataFromSums.sumOfMultiplyXYbar) /
      Math.sqrt(
        parseFloat(dataFromSums.sumOfXminusXbarSquare) *
          parseFloat(dataFromSums.sumOfYminusYbarSquare)
      );
    return result;
  }
  const CorrelationCoefficient = calculateCoef(dataFromSums).toFixed(3);
  return <h1>Correlation Coefficient is : {CorrelationCoefficient}</h1>;
}

function App() {
  const [data, setData] = React.useState({
    x: ["17", "13", "12", "15", "16", "14", "16", "16", "18", "19"],
    y: ["94", "73", "59", "80", "93", "85", "66", "79", "77", "91"],
  });

  React.useEffect(() => {
    <ShowTable />;
  }, [data]);

  const [tempValues, setTempValues] = React.useState({ x: "", y: "" });
  const [isCalculating, setIsCalculating] = React.useState(false);

  function onChange(event) {
    setTempValues({ ...tempValues, [event.target.name]: event.target.value });
  }
  function onSubmit(event) {
    event.preventDefault();
    console.log("CALLED ON SUBMIT");
    let newArr = data;
    newArr.x.push(tempValues.x);
    newArr.y.push(tempValues.y);
    console.log("NEWARR ", newArr);
    setData(newArr);
    setTempValues({ x: "", y: "" });
  }

  function ShowTable() {
    return (
      <table>
        <thead>
          <tr>
            <th colSpan="1">X</th>
            <th colSpan="1">Y</th>
          </tr>
        </thead>
        <tbody>
          {data.x.map((x, i) => {
            return (
              //Yes, This is bad practice for key, but for this instance is ok.
              <tr key={i}>
                <td>{x}</td>
                <td>{data.y[i]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Pearson Regression</h1>
        {isCalculating ? (
          <>
            <CalculatePCC data={data} />
          </>
        ) : (
          <>
            <ShowTable />
            <form onSubmit={onSubmit}>
              <label>Observation from dataset 1</label>
              <input
                type="text"
                placeholder="x"
                name="x"
                value={tempValues.x}
                onChange={onChange}
              />
              <label>Observation from dataset 2</label>
              <input
                type="text"
                placeholder="y"
                name="y"
                value={tempValues.y}
                onChange={onChange}
              />
              <button type="submit">Add</button>
            </form>
            <button type="button" onClick={() => setIsCalculating(true)}>
              Calculate
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
