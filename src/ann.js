import React from "react";
import { useState } from "react";
// import Toggle from "./ToggleRenderProps";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import Container from "react-bootstrap/Container";
// import ReactHtmlParser from "react-html-parser";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Button } from "react-bootstrap";
import "./styles.css";
import {
  numberFormat1,
  numberFormat2,
  numberFormat3,
  // numberFormat4,
  numberFormat5,
  numberFormat6,
} from "./lib"; //ændrer til komma og pct + DKK
import Container from "react-bootstrap/Container";
// import ReactHtmlParser from "react-html-parser";
import { Bar } from "react-chartjs-2";
// import { Doughnut } from "react-chartjs-2";
import DropdownButton from "react-bootstrap/DropdownButton";

import Dropdown from "react-bootstrap/Dropdown";

// import MathJax from "react-mathjax2";

import "handsontable/dist/handsontable.full.css";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";

// import "katex/dist/katex.min.css";
// import { BlockMath } from "react-katex";
// import { InlineMath } from "react-katex";
export function ann() {
  // const numInputs = document.querySelectorAll("input[type=number]");
  // numInputs.forEach(function (input) {
  //   input.addEventListener("change", function (e) {
  //     if (e.target.value === "") {
  //       e.target.value = 1;
  //     }
  //   });
  // });
  const [hovedstol, sethovedstol] = useState(+(20000.0).toFixed(2));
  var [rente, setrente] = useState(+(1.25).toFixed(2));
  var [ydelseinput, setydelseinput] = useState(+(2200).toFixed(2));
  var rentedecimal = rente / 100;
  const [terminer, setterminer] = useState(+(10.0).toFixed(2));
  const [skat, setskat] = useState(+(22.0).toFixed(2));

  const [stiftelse, setstiftelse] = useState(+(0.0).toFixed(2));
  const [kurs, setkurs] = useState(+(100.0).toFixed(2));

  const [anntype, setanntype] = useState("Kendt rente");
  const annSelect = (e) => {
    console.log(e);
    setanntype(e);
  };

  const [prår, setprår] = useState("1 helårlig termin");
  const handleSelect = (e) => {
    console.log(e);
    setprår(e);
  };
  var terminerår = prår.slice(0, 2);
  var fv = hovedstol * (1 + rente / 100) ** terminer;

  const cf = [...Array(terminer + 1).keys()];
  const cfnamed = cf.map((n) => "Tid: " + n);

  var cf2 = Array.apply(null, Array(terminer)).map((_) => "0");
  cf2.splice(0, 0, hovedstol);

  const fvbarchart = Array.apply(null, Array(terminer + 1)).map((_) => "0");
  fvbarchart.splice(terminer, 0, fv.toFixed(2));

  const rentecf = cf.map(
    (cf) =>
      -1 *
      (
        hovedstol * (1 + rente / 100) ** cf -
        hovedstol -
        (hovedstol * (1 + rente / 100) ** (cf - 1) - hovedstol)
      ).toFixed(2)
  );
  rentecf.splice(0, 1, 0);
  var rentespreadsheet = cf.map(
    (cf) =>
      -1 *
      (hovedstol * (1 + rente / 100) ** cf -
        hovedstol -
        (hovedstol * (1 + rente / 100) ** (cf - 1) - hovedstol))
  );
  rentespreadsheet.splice(0, 1, 0);
  var provenue = (hovedstol * kurs) / 100 - stiftelse;

  var ydelse, bsss, bs;

  if (anntype === "Kendt rente") {
    ydelse =
      (hovedstol * rentedecimal) / (1 - Math.pow(1 + rentedecimal, -terminer));
    bs = new Array(terminer).fill(null).map(() => ydelse);
    bs.splice(0, 0, -provenue);
  }

  // ###################################################################################################################

  if (anntype === "Kendt ydelse") {
    ydelse = ydelseinput;
    bs = new Array(terminer).fill(null).map(() => ydelse);
    bs.splice(0, 0, -provenue);

    rente = IRR(bs)
    rentedecimal = rente / 100;
  };

  bsss = bs.map((bs) => numberFormat3(-bs));
  var ydelse1 = bs.map((bs) => bs);
  ydelse1.splice(0, 1, 0);

  const restgæld = cf.map((cf) =>
    Math.abs(
      hovedstol * Math.pow(1 + rentedecimal, cf) -
      (ydelse * (Math.pow(1 + rentedecimal, cf) - 1)) / rentedecimal
    )
  );

  const restgældss = restgæld.map((restgæld) => numberFormat3(restgæld));
  const restgældbc = restgæld.map((restgæld) => restgæld.toFixed(2));

  var renterss = restgæld.map((restgæld) => restgæld * rentedecimal);

  renterss.pop();
  renterss.splice(0, 0, 0);

  var skatss = restgæld.map((restgæld) => restgæld * rentedecimal * (skat / 100));
  skatss.pop();
  skatss.splice(0, 0, 0);


  //const afdragss = ydelsess + renterss;
  //ydelseparsefloat =parseFloatydelsess.splice(0, 1, numberFormat3(0));
  //var afdragss = afdragss.map((ydelsess, renterss) => ydelsess - renterss); 

  //varable til ss spreadsheet
  var afdragss = ydelse1.map((e, i) => e - renterss[i]);
  var ydelsess = ydelse1.map((ydelse1) => numberFormat3(ydelse1));
  renterss = renterss.map((renterss) => numberFormat3(renterss));
  afdragss = afdragss.map((afdragss) => numberFormat3(afdragss));
  // variable til bc barchart
  var renterbc = restgæld.map((restgæld) =>
    (-restgæld * rentedecimal).toFixed(2)
  );
  renterbc.pop();
  renterbc.splice(0, 0, Number(0));
  var ydelsebc = ydelse1.map((ydelse1) => -ydelse1);
  var afdragbc = ydelsebc.map((e, i) =>
    parseFloat(e * 1 - renterbc[i]).toFixed(2)
  );
  let provenuebc = new Array(terminer).fill(null).map(() => 0);
  provenuebc.splice(0, 0, provenue);



  // const sumfunktion = (arr) => arr.reduce((a, b) => a + b, 0);
  // var sumrestgæld = (sumfunktion(restgæld) * rentedecimal).toFixed(2);

  var formatskatss = skatss.map((skatss) => numberFormat3(skatss));
  // var bssss = bs.map((bs, skatss) => numberFormat3(bs - skatss));
  // var bssss = new Array(restgæld).fill(null).map(() => restgæld);
  var bssss = restgæld.map((restgæld) => (restgæld * rentedecimal * (skat / 100) - ydelse));
  // restgæld * rentedecimal * (skat / 100)
  bssss.splice(0, 0, provenue);
  bssss.pop();
  var renteeffektivskat = IRR(bssss);
  var formatbssss = bssss.map((bssss) => numberFormat3(bssss));

  var data1 = [cf, ydelsess, renterss, formatskatss, afdragss, restgældss, bsss, formatbssss];
  var colhead = [
    "Tid",
    "Ydelse\nDKK",
    "Renter\nDKK",
    "Skat\nDKK",
    "Afdrag\nDKK",
    "Restgæld\nDKK",
    "Betalingsstrømme\nDKK",
    "Betalingsstrømme\nefter skat i DKK",
  ];

  // const datadoug = {
  //   labels: [
  //     "Provenue ".concat(numberFormat1(provenue.toFixed(2))),
  //     "Rente ".concat(numberFormat1(sumrestgæld)),
  //   ],
  //   datasets: [
  //     {
  //       label: "Provenue og renter",
  //       backgroundColor: ["orange", "green"],
  //       hoverBackgroundColor: ["darkorange", "darkgreen"],
  //       data: [+provenue.toFixed(2), sumrestgæld],
  //     },
  //   ],
  // };

  const databar = {
    labels: cfnamed,
    datasets: [
      {
        label: "Provenue",
        backgroundColor: "green",
        stack: "Stack 0",
        hoverBackgroundColor: "darkgreen",
        data: provenuebc,
      },
      {
        label: "Afdrag",
        backgroundColor: "red",
        stack: "Stack 0",
        hoverBackgroundColor: "darkred",
        data: afdragbc,
      },

      {
        label: "Rente",
        backgroundColor: "orange",
        stack: "Stack 0",
        hoverBackgroundColor: "darkorange",
        data: renterbc,
      },
    ],
  };

  const databar2 = {
    labels: cfnamed,
    datasets: [
      {
        label: "Restgæld",
        backgroundColor: "green",
        stack: "Stack 0",
        hoverBackgroundColor: "darkgreen",
        data: restgældbc,
      },
    ],
  };

  //VIGTIG til investering ###########################
  // const NPV = (cashflow, discountRate) =>
  //   cashflow.reduce(
  //     (acc, val, i) => acc + val / Math.pow(1 + discountRate, i),
  //     0
  //   );

  function IRR(values, guess) {
    // Credits: algorithm inspired by Apache OpenOffice
    // Calculates the resulting amount
    var irrResult = function (values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      for (var i = 1; i < values.length; i++) {
        result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
      }
      return result;
    };

    // Calculates the first derivation
    var irrResultDeriv = function (values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      for (var i = 1; i < values.length; i++) {
        var frac = (dates[i] - dates[0]) / 365;
        result -= (frac * values[i]) / Math.pow(r, frac + 1);
      }
      return result;
    };

    // Initialize dates and check that values contains at least one positive value and one negative value
    var dates = [];
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
      dates[i] = i === 0 ? 0 : dates[i - 1] + 365;
      if (values[i] > 0) positive = true;
      if (values[i] < 0) negative = true;
    }

    // Return error if values does not contain at least one positive value and one negative value
    if (!positive || !negative) return "#NUM!";

    // Initialize guess and resultRate
    guess = typeof guess === "undefined" ? 0.1 : guess;
    var resultRate = guess;

    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;

    // Set maximum number of iterations
    var iterMax = 50;

    // Implement Newton's method
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate =
        resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop && ++iteration < iterMax);

    if (contLoop) return "#NUM!";

    // Return internal rate of return
    return resultRate * 100;
  }
  var renteeffektiv = IRR(bs);
  var åop = (Math.pow(1 + renteeffektiv / 100, terminerår) - 1) * 100;

  if (terminerår < 2) {
    var prårtekst = "Der er ".concat(
      prår,
      ", den nominelle rente pr. termin er ",
      numberFormat3(rente),
      "%. Helårlig rentetilskrivning betyder den nominelle rente pr. år (nominel rente pr. termin gange 1) bliver det samme altså: ",
      numberFormat3(rente),
      "% p.a."
    );
  } else {
    prårtekst = "Der er ".concat(
      prår,
      ", den nominelle rente pr. termin er ",
      rente,
      "%, det betyder den nominelle rente pr. år (nominel rente pr. termin gange ",
      terminerår,
      ") bliver: ",
      rente * terminerår,
      "%"
    );
  }
  var stiftelsetekst;
  if (stiftelse !== 0) {
    stiftelsetekst = "Der er stiftelsesomkostninger på ".concat(
      numberFormat1(stiftelse),
      ", stiftelsesomkostningerne er omkostninger banken tager for låneadministration. Stiftelsesomkostningerne betyder at den effektive rente pr termin og ÅOP bliver højere end den nominelle rente."
    );
  } else {
    stiftelsetekst =
      "Der er ingen stiftelsesomkostninger, derfor belastes ÅOP ikke af et lavere provenue, stiftelsesomkostningerne er omkostninger banken tager for låneadministration. Stiftelsesomkostningerne betyder at den effektive rente pr termin og ÅOP bliver højere end den nominelle rente.";
  }

  return (
    <div>
      <Container>
        <div class="p-3 mb-2 bg-secondary text-white">

          <h4>Annuitet.</h4>
          
          
        </div>

      </Container>



      <Container className="p-0">
        <div class="row p-3">
          <div class="col-md-12 p-3 ">
            <div class="card h-100">
              <div class="card-body">
                <Container className="p-3">
                  <div class="p-3 mb-2 bg-white">

                    <Form.Group>
                      {anntype === "Kendt ydelse" &&
                        <InputGroup>
                          <Form.Control
                            // size="sm"
                            type="number"
                            value={ydelseinput}
                            onChange={(e) => setydelseinput(+e.target.value)}
                            aria-describedby="inputGroupAppend"
                            placeholder="0"
                          />
                          <InputGroup.Append>
                            <InputGroup.Text id="inputGroupAppend">
                              Ydelse pr. termin i DKK.
                      </InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>

                      }
                      {anntype === "Kendt rente" &&
                        <InputGroup>
                          <Form.Control
                            // size="sm"
                            type="number"
                            value={rente}
                            onChange={(e) => setrente(+e.target.value)}
                            aria-describedby="inputGroupAppend"
                            placeholder="0"
                          />
                          <InputGroup.Append>
                            <InputGroup.Text id="inputGroupAppend">
                              Rente pr. termin i %
                      </InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>
                      }
                      <InputGroup input-group-sm>
                        <Form.Control
                          type="number"
                          min="1"
                          value={terminer}
                          onChange={(e) =>
                            setterminer(+e.target.value.replace(/\D/, ""))
                          }
                          aria-describedby="inputGroupAppend"
                          placeholder="0"
                        />
                        <InputGroup.Append >
                          <InputGroup.Text id="inputGroupAppend">
                            Terminer totalt
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>

                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={hovedstol}
                          onChange={(e) => sethovedstol(+e.target.value)}
                          aria-describedby="inputGroupAppend"
                          placeholder="0"
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="inputGroupAppend">
                            Hovedstol DKK.
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>

                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={+stiftelse}
                          onChange={(e) => setstiftelse(+e.target.value)}
                          aria-describedby="inputGroupAppend"
                          placeholder="0"
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="inputGroupAppend">
                            Stiftelse i DKK.
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>




                      <InputGroup>
                        <Form.Control
                          type="number"
                          min="1"
                          max="100"
                          step={1}
                          precision={0}
                          mobile={true}
                          value={kurs}
                          onChange={(e) =>
                            setkurs(+e.target.value.replace(/\D/, ""))
                          }
                          aria-describedby="inputGroupAppend"
                          placeholder="0"
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="inputGroupAppend">
                            Kurs på lånet
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={+skat}
                          onChange={(e) => setskat(+e.target.value)}
                          aria-describedby="inputGroupAppend"
                          placeholder="0"
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="inputGroupAppend">
                            Skat i %
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>

                      <br />
                      <Form.Group>
                        <DropdownButton
                          // size="sm"
                          alignleft
                          variant="warning"
                          title={prår}
                          id="dropdown-align-left"
                          // id="dropdown-split-basic"
                          onSelect={handleSelect}
                        >
                          <Dropdown.Item eventKey="1 helårlig termin">
                            Vælg 1 helårlig termin
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="2 halvårlige terminer">
                            Vælg 2 halvårlige terminer
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="4 kvartalsvise terminer">
                            Vælg 4 kvartalsvise terminer
                          </Dropdown.Item>
                          {/* <Dropdown.Divider /> */}
                          <Dropdown.Item eventKey="12 månedlige terminer">
                            Vælg 12 månedlige terminer
                          </Dropdown.Item>
                        </DropdownButton>
                      </Form.Group>




                    </Form.Group>
                    <Form.Group>
                      <DropdownButton
                        alignleft
                        variant="warning"
                        title={anntype}
                        id="anntype"
                        // id="dropdown-split-basic"
                        onSelect={annSelect}
                      >
                        <Dropdown.Item eventKey="Kendt rente">
                          Vælg kendt rente
                          </Dropdown.Item>
                        <Dropdown.Item eventKey="Kendt ydelse">
                          Vælg kendt ydelse
                          </Dropdown.Item>

                      </DropdownButton>
                    </Form.Group>



                  </div>
                </Container>
              </div>
            </div>
          </div>

        </div>
      </Container >









      <Container className="p-0">
        <div class="p-3 mb-2 bg-white text-black">
          <div class="card">
            <div class="card-body">
              {anntype === "Kendt rente" && <h3>Ydelsen er {numberFormat1(ydelse)} over de {terminer} terminer</h3>}
              {anntype === "Kendt ydelse" && <h3>Terminsrenten er {numberFormat3(rente)}%, med {prår} bliver ÅOP {numberFormat3(åop)}%</h3>}
              <div>
                <Bar
                  data={databar}
                  width={100}
                  height={70}
                  options={
                    ({ maintainAspectRatio: false },
                    {
                      scales: {
                        yAxes: [
                          {
                            scaleLabel: {
                              display: true,
                              labelString: "Betalingsstrømme",
                            },
                            ticks: {
                              callback: function (value, index, values) {
                                return value + " DKK";
                              },
                            },
                          },
                        ],
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container className="p-0">
        <div class="p-3 mb-2 bg-white text-black">
          <div class="card">
            <div class="card-body">
              <h3>Restgælden over de {terminer} terminer</h3>
              <div>
                <Bar
                  data={databar2}
                  width={100}
                  height={70}
                  options={
                    ({ maintainAspectRatio: false },
                    {
                      scales: {
                        yAxes: [
                          {
                            scaleLabel: {
                              display: true,
                              labelString: "Restgælden",
                            },
                            ticks: {
                              callback: function (value, index, values) {
                                return value + " DKK";
                              },
                            },
                          },
                        ],
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container className="p-0">
        <div class="container">
          <table class="table table-bordered table-responsive table-white table-hover table-striped ">
            <small>
              <thead>
                <span class="align-middle">
                  <tr>
                    <br />

                    <h3>&nbsp;&nbsp;&nbsp;Forklaring på variable</h3>

                    <br />
                  </tr>
                </span>
              </thead>
              <tbody>
                <span class="align-top">
                  <tr>
                    <th>Variabel</th>
                    <th>Værdi</th>
                    <th>DK Excel kode</th>
                    <th>US Excel kode</th>
                    <th>Forklaring</th>
                  </tr>
                  <tr>
                    <th scope="row">Ydelse i DKK</th>
                    <td>{numberFormat1(ydelse)}</td>
                    <td>YDELSE</td>
                    <td>PMT</td>
                    <td>
                      Den faste ydelse {numberFormat1(ydelse)}, der skal betales
                      ved hver af de {terminer} terminer, består af renter og
                      afdrag. Rentedelen beregnes af restgælden og er derfor
                      faldende, afdragsdelen er voksende.<br />
                      {anntype === "Kendt rente" &&
                        "Nedenfor ses formlen og udregningen for ydelsen:\n" +
                        "Ydelse = (NV*Rente)/(1-(1+Rente)^NPER) =\n" +
                        "(" + numberFormat6(hovedstol) + "*" +
                        numberFormat6(rentedecimal) +
                        ") / (1 - (1 + " + numberFormat6(rentedecimal) + ")^(-" + terminer + ")) =\n" + numberFormat3(
                          ydelse) +
                        "\nMan kan udregne ydelsen " + numberFormat1(- ydelse) +
                        " i Excel ved følgende formel:\n=YDELSE("
                        + numberFormat2(rente) + "%;" + terminer + ";" + hovedstol + ";0)\nYdelsen kan på en lommeregner udregnes som:\n"
                        + "(" + numberFormat5(hovedstol) + "*" +
                        numberFormat5(rentedecimal) +
                        ") / (1 - (1 + " + numberFormat5(rentedecimal) + ")^(-" + terminer + "))"
                      }
                    </td>
                  </tr>

                  

                  <tr>
                    <th scope="row">
                      Restgæld i DKK
                      
                      
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      Restgælden kan beregnes ud fra formlen er beløbet man låner på papiret på tidspunkt:<br></br>
                      Restgæld ultimo termin 1 =NV*(1 + RENTE)^1 - (PMT (1 + RENTE)^1 -1 )/RENTE =<br></br> 
                      {numberFormat5(hovedstol)}*(1+{numberFormat5(rentedecimal)})^1- {numberFormat5(ydelse)}*(1+{numberFormat5(rentedecimal)})^1-1)/{numberFormat5(rentedecimal)} =<br></br>
                       {numberFormat1(restgæld[1])}
                       {<hr />}
                       Restgæld ultimo termin 2 =NV*(1 + RENTE)^2 - (PMT (1 + RENTE)^2 -1 )/RENTE =<br></br> 
                      {numberFormat5(hovedstol)}*(1+{numberFormat5(rentedecimal)})^2- {numberFormat5(ydelse)}*(1+{numberFormat5(rentedecimal)})^2-1)/{numberFormat5(rentedecimal)} =<br></br>
                       {numberFormat1(restgæld[2])}
                       {<hr />}
                       Restgæld ultimo termin 3 =NV*(1 + RENTE)^3 - (PMT (1 + RENTE)^3 -1 )/RENTE =<br></br> 
                      {numberFormat5(hovedstol)}*(1+{numberFormat5(rentedecimal)})^3- {numberFormat5(ydelse)}*(1+{numberFormat5(rentedecimal)})^3-1)/{numberFormat5(rentedecimal)} =<br></br>
                       {numberFormat1(restgæld[3])}
                       <br></br> 
                       ...
                      
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">
                    Rente i DKK
                      
                      
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      Renten i DKK er forskellig for hver termin, denne beregnes som renten af restgælden :<br></br>
                      Rente termin 1 = Restgæld primo termin 1 * RENTE =<br></br> 
                      {numberFormat5(restgæld[0])}*{numberFormat5(rentedecimal)} = {numberFormat1(restgæld[0]*rentedecimal)}
                      {<hr />}
                      Rente termin 2 = Restgæld primo termin 2 * RENTE =<br></br> 
                      {numberFormat5(restgæld[1])}*{numberFormat5(rentedecimal)} = {numberFormat1(restgæld[1]*rentedecimal)}
                       {<hr />}
                       Rente termin 3  = Restgæld primo termin 3 * RENTE =<br></br> 
                       {numberFormat5(restgæld[2])}*{numberFormat5(rentedecimal)} = {numberFormat1(restgæld[2]*rentedecimal)}
                       <br></br> 
                       ...
                      
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">
                    Skat i DKK
                      
                      
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      Skat af renteudgifter refunderes af skattemyndighederne, skatten beregnes som rente gange skatteprocenten:<br></br>
                      Skattebesparelse termin 1 = RENTE termin 1 * skatteprocent =<br></br> 
                      {numberFormat5(restgæld[0]*rentedecimal)}*{numberFormat5(skat)}% = {numberFormat1(restgæld[0]*rentedecimal*skat/100)}
                      {<hr />}
                      Skattebesparelse termin 1 = RENTE termin 1 * skatteprocent =<br></br> 
                      {numberFormat5(restgæld[1]*rentedecimal)}*{numberFormat5(skat)}% = {numberFormat1(restgæld[1]*rentedecimal*skat/100)}
                       {<hr />}
                       Skattebesparelse termin 1 = RENTE termin 1 * skatteprocent =<br></br> 
                      {numberFormat5(restgæld[2]*rentedecimal)}*{numberFormat5(skat)}% = {numberFormat1(restgæld[2]*rentedecimal*skat/100)}
                       <br></br> 
                       ...
                      
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">
                    Afdrag i DKK
                      
                      
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      Afdraget bestemmes som Ydelse minus renter:<br></br>
                      Afdrag termin 1 = Ydelse - RENTE<br></br> 
                      {numberFormat5(ydelse)} - {numberFormat5(restgæld[0]*rentedecimal)}% = {numberFormat1(ydelse-restgæld[0]*rentedecimal)}
                      {<hr />}
                      Afdrag termin 2 = Ydelse - RENTE<br></br> 
                      {numberFormat5(ydelse)} - {numberFormat5(restgæld[1]*rentedecimal)}% = {numberFormat1(ydelse-restgæld[1]*rentedecimal)}
                       {<hr />}
                       Afdrag termin 3 = Ydelse - RENTE<br></br> 
                      {numberFormat5(ydelse)} - {numberFormat5(restgæld[2]*rentedecimal)}% = {numberFormat1(ydelse-restgæld[2]*rentedecimal)}
                       <br></br> 
                       ...
                      
                    </td>
                  </tr>



                  <tr>
                    <th scope="row">
                      Hovedstol
                      <br />
                      Nutidsværdi
                    </th>
                    <td>{numberFormat1(hovedstol)}</td>
                    <td>NV</td>
                    <td>PV</td>
                    <td>
                      Nutidsværdien er beløbet man låner på papiret på tidspunkt
                      0 (dvs. nu)
                    </td>
                  </tr>


                  <tr>
                    <th scope="row">Rente pr. termin nominel</th>
                    <td>{numberFormat3(rente)}%</td>
                    <td>RENTE</td>
                    <td>RATE</td>
                    <td>


                      Nominel pålydende, rente, her angivet i procent. Hvis den
                      nominelle rente er angivet pr år (pro anno), kan den
                      nominelle terminsrente findes ved at dividere pro anno
                      renten med antal terminer pr. år.
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">Terminer pr. år</th>
                    <td>{terminerår}</td>
                    <td></td>
                    <td></td>
                    <td>{prårtekst}</td>
                  </tr>

                  <tr>
                    <th scope="row">Terminer</th>
                    <td>{terminer}</td>
                    <td>NPER</td>
                    <td>NPER</td>
                    <td>
                      Det totale antal af perioder (her {terminer}), hvor der
                      tilskrives rente kaldes for antallet af terminer.
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">Stiftelse</th>
                    <td>{numberFormat1(stiftelse)}</td>
                    <td></td>
                    <td></td>
                    <td>{stiftelsetekst}</td>
                  </tr>

                  <tr>
                    <th scope="row">Kurs</th>
                    <td>{kurs}</td>
                    <td></td>
                    <td></td>
                    <td>
                      Kursen angiver hvor meget lånet er værd, er kursen under
                      100 vil der være et kurstab. Er der kurstab, betyder dette
                      at den effektive rente pr termin og ÅOP bliver højere end
                      den nominelle rente. Kursen fastsættes ud fra markedets
                      prissætning af lånet, hvilket fx. afhænger af debitors
                      kreditværdighed, renten på alternative investeringer samt
                      øvrige makroøkonomiske faktorer.
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">Provenue</th>
                    <td>{numberFormat1(provenue)}</td>
                    <td></td>
                    <td></td>
                    <td>
                      Provenuet er det beløb man får udbetalt, dvs. hovedstolen
                      efter kurstab og stiftelsesomkostninger. Provenuet kan
                      findes som:

                      {"\nProvenue = PV*Kurs/100-Stiftelsesomkostninger =\n" +
                        numberFormat3(hovedstol) + "*" + numberFormat2(kurs) + "/100 - " + numberFormat3(
                          stiftelse
                        ) + " = " + numberFormat3(provenue)
                      }
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">Rente pr. termin effektiv</th>
                    <td>{numberFormat3(renteeffektiv)}%</td>
                    <td>RENTE</td>
                    <td>RATE</td>
                    <td>
                      Renten pr. termin korrigeret for eventuelt kurstab og
                      stiftelsesomkostninger. Renten kan ikke udregnes eksplicit
                      for et annuitetslån, så man skal bruge en finansfunktion
                      på sin computer eller i fx. Excel hvor formlen er:
                      <br></br>
                      =RENTE({terminer};{numberFormat6(-ydelse)};{" "}
                      {numberFormat6(provenue)})
                      <br />
                    </td>
                  </tr>


                  <tr>
                    <th scope="row">Rente pr. termin effektiv efter skat</th>
                    <td>{numberFormat3(renteeffektivskat)}%</td>
                    <td></td><td></td>
                    <td>
                      Renten pr. termin korrigeret for eventuelt kurstab og
                      stiftelsesomkostninger samt skat. Renten kan ikke udregnes eksplicit
                      for et serielån, så man skal bruge en finansfunktion
                      på sin computer eller i fx. Excel hvor formlen er:
                      <br></br>
                      =IA(betalingsstrømme minus skat)

                      <br />
                    </td>
                  </tr>


                  <tr>
                    <th scope="row">ÅOP</th>
                    <td>{numberFormat3(åop)}%</td>
                    <td></td>
                    <td></td>
                    <td>
                      Renten pr. år korrigeret for eventuelt kurstab,
                      stiftelsesomkostninger og antal rentetilskrivninger pr.
                      år. ÅOP bestemmes ud fra den effektive rente pr. termin,
                      korrigeret for renters rente, ud fra antallet af
                      rentetilskrivninger pr. år. Formlen er:
                      {"\nÅOP = ((1 + RENTE)^Terminer pr år - 1)*100 = \n" +
                        "((1 + " + numberFormat5(renteeffektiv / 100) + ")^" +
                        numberFormat5(terminerår) + " - 1)*100 = " + numberFormat5(åop) + "%"
                      }


                      <br></br>ÅOP kan derfor på en lommeregner udregnes som:
                      <br />
                      <i>
                        ((1+
                        {numberFormat5(renteeffektiv / 100)})^
                        {numberFormat6(terminerår)}-1)*100
                      </i>
                    </td>
                  </tr>




                  <tr>
                    <th scope="row">ÅOP efter skat</th>
                    <td>{numberFormat3((((1 + renteeffektivskat / 100) ** terminerår - 1)) * 100)}%</td>
                    <td></td><td></td>
                    <td>

                      Renten pr. år korrigeret for skat, kurstab,
                      stiftelsesomkostninger og antal rentetilskrivninger pr.
                      år. ÅOP minus skat bestemmes ud fra den effektive rente minus skat pr. termin,
                      korrigeret for renters rente, ud fra antallet af
                      rentetilskrivninger pr. år. Formlen er:
                      {"\nÅOP = ((1 + RENTE-skat)^Terminer pr år - 1)*100 = \n" +
                        "((1 + " + numberFormat5(renteeffektivskat / 100) + ")^" +
                        numberFormat5(terminerår) + " - 1)*100 = " + numberFormat3((((1 + renteeffektivskat / 100) ** terminerår - 1)) * 100) + "%"
                      }


                      <br></br>ÅOP efter skat kan derfor på en lommeregner udregnes som:
                      <br />
                      <i>
                        ((1+
                        {numberFormat5(renteeffektivskat / 100)})^
                        {numberFormat6(terminerår)}-1)*100
                      </i>
                    </td>
                  </tr>




                </span>
              </tbody>
            </small>
          </table>
        </div>
      </Container>

      <Container className="p-3 mb-2 ">
        <HotTable
          data={Handsontable.helper.translateRowsToColumns(data1)}
          colHeaders={colhead}
          // colHeaders={true}
          // rowHeaders={true}
          // width="1120"
          // colWidths="[10,300, 300,300,300,300,300, 300,300,300,300,300]"
          // colWidths="100"
          width="100%"
          // scrollH="auto"
          stretchH="all"
          className="htRight"
          preventOverflow="hidden"
          // fixedRowsTop="1"
          manualColumnResize="100"
          height="320"
          // overflow="hidden"
          licenseKey="non-commercial-and-evaluation"
        />
      </Container>
      {/* <Container className="p-0">
        <div class="row p-3">
          <div class="col-md-3 p-3 container-fluid">
            <div class="card h-100">
              <div class="card-body bg-white">
                <h3>Provenue og renter</h3>
                <div>
                  <Doughnut
                    data={datadoug}
                    height={400}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
                {/* </ResponsiveContainer> */}
              {/* </div>
            </div>
          </div>
        </div>
      </Container > */} 
    </div >
  );
}
