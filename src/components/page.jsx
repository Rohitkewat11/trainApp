import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";

function Page() {
  const [stop, setStop] = useState();
  const [arrival, setArrival] = useState();
  const [departure, setDeparture] = useState();
  const [route, setRoute] = useState([]);
  const [station,setStation] = useState([]);
  const [trains,setTrains] = useState();
  const [day,setDay] = useState();
  const [filteredTrain,setFilteredTrain] = useState([]);


  // for add new trains
  const formik = useFormik({
    initialValues: {
      trainName: "",
      trainNo: "",
      day: [],
      route: [],
    },
    onSubmit: (value) => {
      value.route = route;
      axios
        .post("http://127.0.0.1:5000/addTrain", value)
        .then((res) => {
          alert(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  // for add new staions //
  const fromikStation = useFormik({
    initialValues:{
      stationName:"",
      stationCode:""
    },
    onSubmit:((value)=>{
      axios.post("http://127.0.0.1:5000/addStation",value)
      .then((res)=>{
        alert(res.data);
      }).catch((err)=>{
        console.log(err);
      })
    })
  })

  // for search trains
  const formikUser = useFormik({
    initialValues:{
      date:"",
      from:"",
      to:""
    },
    onSubmit:((value)=>{
      value.date = day;

      const filteredTrains = trains.filter((train) => {
        
       const isRunningOnDay = train.day.includes(value.date);
  
        const   IsFromStation = train.route.some(stop => stop.stop === value.from);
       const IsToStation = train.route.some(stop => stop.stop === value.to);
  
        return (isRunningOnDay && IsFromStation && IsToStation);
        // ||(IsFromStation && IsToStation);
      })
      setFilteredTrain(filteredTrains);
  })
})

  function handleAddRoute() {
    setRoute((prev) => [
      ...prev,
      {
        stop: stop,
        arrival: arrival,
        departure: departure,
      },
    ]);
  }


  function handleDate(e){
    const week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const temp = new Date(e.target.value).getDay();
    setDay(week[temp]);
  }


  // get trains data//
  const stationData = ()=>{
    axios.get("http://127.0.0.1:5000/trains")
    .then((res)=>{
      setTrains(res.data);
    }).catch((err)=>{
      console.log(err);
      
    })
  }

  useEffect(()=>{
    // get stations data//
    axios.get("http://127.0.0.1:5000/stations")
    .then((res)=>{
      setStation(res.data);
    }).catch((err)=>{
      console.log(err);
    })

    stationData();

    // // get trains data//
    // axios.get("http://127.0.0.1:5000/trains")
    // .then((res)=>{
    //   setTrains(res.data);
    // }).catch((err)=>{
    //   console.log(err);
      
    // })
  },[]);
  
  return (
    <>
      <fieldset>
        <legend>Admin</legend>
        <div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="">Train Name:</label>
            <input
              type="text"
              name="trainName"
              placeholder="Train Name"
              onChange={formik.handleChange}
            />
            <label htmlFor="">Train No:</label>
            <input
              type="text"
              name="trainNo"
              placeholder="Train No"
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <p>Day:</p>
            <input
              type="checkbox"
              name="day"
              value="Sun"
              id="sun"
              onChange={formik.handleChange}
            />
            <label htmlFor="sun">Sun</label>
            <input
              type="checkbox"
              name="day"
              value="Mon"
              id="mon"
              onChange={formik.handleChange}
            />
            <label htmlFor="mon">Mon</label>
            <input
              type="checkbox"
              name="day"
              value="Tue"
              id="tue"
              onChange={formik.handleChange}
            />
            <label htmlFor="tue">Tue</label>
            <input
              type="checkbox"
              name="day"
              value="Wed"
              id="wed"
              onChange={formik.handleChange}
            />
            <label htmlFor="wed">Wed</label>
            <input
              type="checkbox"
              name="day"
              value="Thu"
              id="thu"
              onChange={formik.handleChange}
            />
            <label htmlFor="thu">Thu</label>
            <input
              type="checkbox"
              name="day"
              value="Fri"
              id="fri"
              onChange={formik.handleChange}
            />
            <label htmlFor="fri">Fri</label>
            <input
              type="checkbox"
              name="day"
              value="Sat"
              id="sat"
              onChange={formik.handleChange}
            />
            <label htmlFor="sat">Sat</label>
          </div>
          <div>
            <p>Route:</p>
            <label>Stop:</label>
            <input
              type="text"
              onChange={(e) => {
                setStop(e.target.value);
              }}
              placeholder="stop Name"
            />
            <label>Arrival:</label>
            <input
              type="time"
              onChange={(e) => {
                setArrival(e.target.value);
              }}
            />
            <label>Departure:</label>
            <input
              type="time"
              onChange={(e) => {
                setDeparture(e.target.value);
              }}
            />
            <button type="button" onClick={handleAddRoute}>
              Add Route
            </button>
          </div>
          <button type="sumbit">Add Train</button>
        </form>
      </div>

      <div>
        <h3>Route table</h3>
              <table>
                <thead>
                  <tr>
                    <td>stop</td>
                    <td>arrival</td>
                    <td>departure</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    route.map((item)=>
                      <tr>
                        <td>{item.stop}</td>
                        <td>{item.arrival}</td>
                        <td>{item.departure}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              <br />
              <br />
            </div>
            {/* add staions name and code  */}
            <fieldset>
              <legend>Add Station</legend>
              <div>
              <form onSubmit={fromikStation.handleSubmit}>
                <label>station Name</label>
                <input type="text" name="stationName" onChange={fromikStation.handleChange} placeholder="station name" />
                <label>station code</label>
                <input type="text" name="stationCode" onChange={fromikStation.handleChange} placeholder="station code" />
                <button type="submit">Add station</button>
              </form>
            </div>
            </fieldset>
      </fieldset>
                  <br />
                  <br />
      <fieldset>
        <legend>User</legend>
        <div>
          <form onSubmit={formikUser.handleSubmit}>
            <div>
            <label>Date</label>
            <input name="date" type="date" onChange={handleDate} />
            </div>
            <div>
              <label>From:</label>
              <select name="from" onChange={formikUser.handleChange}>
              <option value="-1">Select station</option>
                {
                  station.map((val)=>
                    <option>{val.stationName}</option>
                  )
                }
              </select>
              <label>To:</label>
              <select name="to" onChange={formikUser.handleChange}>
              <option value="-1">Select station</option>
                {
                  station.map((val)=>
                    <option>{val.stationName}</option>
                  )
                }
              </select>
            </div>
            <button type="submit">Search</button>
          </form>
        </div>
      </fieldset>

      <fieldset>
        <legend>Available Trains</legend>
        <table>
          <thead>
            <tr>
              <td>train No.</td>
              <td>train Name</td>
              <td>Day</td>
              <td>Route</td>
            </tr>
          </thead>
          <tbody>
            {
              filteredTrain.map((train)=>
                <tr>
                  <td>{train.trainNo}</td>
                  <td>{train.trainName}</td>
                  <td>{train.day.join(",")}</td>
                  <td>
                    <table>
                      <thead>
                        <tr>
                          <td>Stop</td>
                          <td>Arrival</td>
                          <td>Departure</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          train.route.map((stop)=>
                            <tr>
                              <td>{stop.stop}</td>
                              <td>{stop.arrival}</td>
                              <td>{stop.departure}</td>
                            </tr>
                          )
                        }
                      </tbody>
                    </table>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </fieldset>
    </>
  );
}

export default Page;
