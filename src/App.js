import React from "react";
import "./App.css";

//Pearson's Correlation Coefficient
function CalculatePCC({ data, ShowTable, isCalculating }) {
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

  //This will be used to pass data to ShowTable component.
  const AllDataInside = {
    x: data.x,
    y: data.y,
    meanX: meanXY.meanX,
    meanY: meanXY.meanY,
    XminusXbar: dataFromSquareCalculations.XminusXbar,
    XminusXbarSquare: dataFromSquareCalculations.XminusXbarSquare,
    YminusYbar: dataFromSquareCalculations.YminusYbar,
    YminusYbarSquare: dataFromSquareCalculations.YminusYbarSquare,
    sumOfMultiplyXYbar: dataFromSums.sumOfMultiplyXYbar,
    sumOfXminusXbarSquare: dataFromSums.sumOfXminusXbarSquare,
    sumOfYminusYbarSquare: dataFromSums.sumOfYminusYbarSquare,
    multiplyXminusXbarYminusYbar:
      dataFromSquareCalculations.multiplyXminusXbarYminusYbar,
  };

  const CorrelationCoefficient = calculateCoef(dataFromSums).toFixed(3);
  console.log(Math.abs(CorrelationCoefficient));
  // Tell level of correlation
  function levelOfCorrelation(CorrelationCoefficient) {
    //Use ABS in case coefficient is minus
    const coef = Math.abs(CorrelationCoefficient);
    if (coef === 0) {
      return "No correlation";
    } else if (coef < 0.29) {
      return "Small Correlation";
    } else if (coef >= 0.3 && coef < 0.49) {
      return "Medium Correlation";
    } else if (coef > 0.49 && coef < 1) {
      return "Strong Correlation";
    }
  }

  const levelOfCorrelationString = levelOfCorrelation(CorrelationCoefficient);
  return (
    <>
      <h1>
        Correlation Coefficient is : {CorrelationCoefficient}, there is a{" "}
        {levelOfCorrelationString}
      </h1>

      <ShowTable isCalculating={isCalculating} data={AllDataInside} />
    </>
  );
}

function ShowTable({ isCalculating, data }) {
  if (isCalculating) {
    console.log(data);
    return (
      <table>
        <thead>
          <tr>
            <th colSpan="1">X</th>
            <th colSpan="1">Y</th>
            <th colSpan="1">(x-x̄)</th>
            <th colSpan="1">(y-ȳ)</th>
            <th colSpan="1">(x-x̄)*(y-ȳ)</th>
            <th colSpan="1">(x-x̄)²</th>
            <th colSpan="1">(y-ȳ)²</th>
          </tr>
        </thead>
        <tbody>
          {data.x.map((x, i) => {
            return (
              //Yes, This is bad practice for key, but for this instance is ok.
              <tr key={i}>
                <td>{x}</td>
                <td>{data.y[i]}</td>
                <td>{data.XminusXbar[i]}</td>
                <td>{data.YminusYbar[i]}</td>
                <td>{data.multiplyXminusXbarYminusYbar[i]}</td>
                <td>{data.XminusXbarSquare[i]}</td>
                <td>{data.YminusYbarSquare[i]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else {
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
}

function App() {
  const [data, setData] = React.useState({
    x: ["17", "13", "12", "15", "16", "14", "16", "16", "18", "19"],
    y: ["94", "73", "59", "80", "93", "85", "66", "79", "77", "91"],
  });

  React.useEffect(() => {
    <ShowTable data={data} />;
  }, [data]);

  const [tempValues, setTempValues] = React.useState({ x: "", y: "" });
  const [isCalculating, setIsCalculating] = React.useState(false);

  function onChange(event) {
    setTempValues({ ...tempValues, [event.target.name]: event.target.value });
  }
  function onSubmit(event) {
    event.preventDefault();
    let newArr = data;
    newArr.x.push(tempValues.x);
    newArr.y.push(tempValues.y);
    setData(newArr);
    setTempValues({ x: "", y: "" });
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Pearson Regression</h1>
        {isCalculating ? (
          <>
            <CalculatePCC
              data={data}
              ShowTable={ShowTable}
              isCalculating={isCalculating}
            />
          </>
        ) : (
          <>
            <ShowTable data={data} />
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
