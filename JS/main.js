var HTTP = {
  baseUrl: "http://api.openweathermap.org/data/2.5/forecast?q=",
  key: "&appid=dbb624c32c7f0d652500552c5ebbde56",
	get: function (city) {
		return fetch(this.baseUrl + city + this.key)
			.then(function (response) {
				return response.json();
			});
	}
};


var Form = React.createClass({
	getInitialState: function () {
		return { formValue: "" };
	},

	onChange: function (e) {
		this.setState({ formValue: e.target.value });
	},

	clear: function () {
		this.setState({ formValue: "" });
	},

	render: function () {
		var iconStyle = {
			background: "#B91111",
			color: "#FFF",
			border: 0
		};
    
		return (
			<form action="" method="" onSubmit={this.props.callback}>
				<div className="col-xs-10 col-xs-offset-1 input-group">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="Location.."
							value={this.state.formValue}
							onChange={this.onChange}
						/>
						<span onClick={this.props.callback} className="input-group-addon" style={iconStyle}><i className="glyphicon glyphicon-search"></i></span>
					</div>
				</div>
		    </form>
		);
	}
});


var Wind = React.createClass({
	windDirection: function (windDeg) {
		var wind = "";

		if (windDeg > 340 && windDeg <= 20) {
      wind = "North";
    }

		else if (windDeg > 20 && windDeg <= 70) {
			wind = "North-East";
		}

		else if (windDeg > 70 && windDeg <= 110) {
			wind = "East";
		}

		else if (windDeg > 110 && windDeg <= 160) {
			wind = "South-East";
		}

		else if (windDeg > 160 && windDeg <= 200) {
			wind = "South"
		}

		else if (windDeg > 200 && windDeg <= 250) {
			wind = "South-West";
		}

		else if (windDeg > 250 && windDeg <= 290) {
			wind = "West";
		}

		else if (windDeg > 290 && windDeg <= 340) {
			wind = "North-West";
		}

		return wind;
	},

	render: function () {
    var spanStyle = { marginRight: 35, float: "right" };
		
    return (
			<div className="row">
				<div className="col-xs-11 col-xs-offset-1">
					<img src="http://icons.iconarchive.com/icons/handdrawngoods/sunny-weather/128/07-wind-breeze-icon.png" className="img-responsive" width="35" height="35"/>
					<span>{this.props.wind + " m/s"}</span>
          <span style={spanStyle}>{this.windDirection(this.props.windDeg)}</span>
				</div>
			</div>
		);
	}
});


var CurrentWeather = React.createClass({
	convert: function (temp) {
		return (temp - 273.15).toFixed(1) + "°C";
	},

	getDate: function (date) {
		var d = new Date(date * 1000);
		return d.toDateString().slice(0, 10);
	},

	render: function () {
		
		var tempStyle = {
			fontWeight: 700,
			display: "inline"
		};

		var metaStyle = {
			textAlign:"center"
		};

		var inline = {
			display:"inline"
		};

		return (
			<div>
        <div className="row">
          <br/>
          <div className="col-xs-11 col-xs-offset-1">
            <h2 style={inline}>{this.props.city}</h2>
            <p>{this.getDate(this.props.date)}</p>
          </div>
        </div>

        <br/>

        <div className="row">
          <div className="col-xs-6 col-xs-offset-3">
            <img style={inline} src={this.props.weatherIcon} alt="icon" width="50" height="50"/>
            <h1 style={tempStyle}>&nbsp;{this.convert(this.props.celsius)}</h1>
            <p style={metaStyle}>{this.props.meta}</p>
          </div>
        </div>

        <br/>

        <Wind wind={this.props.wind} windDeg={this.props.windDeg} />
      </div>
		);
	}
});


var ForecastCol = React.createClass({
	getDate: function (timestamp) {
		var d = new Date(timestamp * 1000);
		return d.toDateString().slice(0, 10);
	},

	convert: function (temp) {
		var celsius = (temp - 273.15).toFixed(1) + "°C";
		var fahrenheit = (parseFloat(celsius, 10) * (9 / 5) + 32).toFixed(2) + "°F";
		return celsius + " / " + fahrenheit;
	},

	setImgUrl: function (icon) {
		return "http://openweathermap.org/img/w/" + icon + ".png";
	},

	render: function () {
    
		var imgStyle = {
			display: "inline"
		};

		var paraStyle = {
			marginTop: 10,
      fontWeight: 700
		};

		var divStyle = {
			height: 60,
			display: "block",
			margin: "0 auto",
			textAlign: "center"
		};

		return (
			<div>
				<div style={divStyle} className="col-xs-4">
					<p style={paraStyle}>{this.getDate(this.props.forecastDate)}</p>
				</div>
				
				<div style={divStyle} className="col-xs-4">
					<img src={this.setImgUrl(this.props.forecastIcon)} 
					style={imgStyle} className="img-responsive" width="50" height="50"/>
				</div>
				
				<div style={divStyle} className="col-xs-4">
					<p style={paraStyle}>{this.convert(this.props.forecastTemp)}</p>
				</div>
			</div>
		);
	}
});


var WeatherContainer = React.createClass({
	getInitialState: function () {
		return {
			city: "",
			date: "",
			celsius: "",
			weatherIcon: "",
			wind: "",
			windDeg: "",
			meta: "",
			forecastData: []
		};
	},

	setter: function (data) {
		this.setState({
			city: data.city.name,
			date: data.list[0].dt,
			celsius: data.list[0].main.temp,
			weatherIcon: "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png",
			wind: data.list[0].wind.speed,
			windDeg: data.list[0].wind.deg,
			meta: data.list[0].weather[0].description,
			forecastData: data
		});
	},

	componentWillMount: function () {
		$.getJSON("http://ipinfo.io", function (data) {
			var coords = data.loc.split(",");
		   	var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=";
		    weatherUrl += coords[0] + "&lon=" + coords[1] + "&appid=dbb624c32c7f0d652500552c5ebbde56";
		    
        $.getJSON(weatherUrl, function (data) {
		    	this.setter(data);
		    }.bind(this));
		}.bind(this));
	},

	onSubmit: function (e) {
		e.preventDefault();
		var location = this.refs.form.state.formValue;

		HTTP.get(location)
			.then(function (data) {
				this.refs.form.clear();
				this.setter(data);
			}.bind(this));
	},

	render: function () {
		if (this.state.forecastData.length === 0) return null;

		var colStyle = {
			marginTop: 80,
		};

		var panel = {
			borderRadius: 7,
			border: 0
		};

		var panelHead = {
			
			background: "#EC4444",
			color: "#FFF"
		};

    document.body.style.background = "#191919";

		var rows = [];
		for (var i = 1; i < 40; i++) {
			if (i % 8 === 0) {
				rows.push(
					<ForecastCol
						key={i}
						forecastDate={this.state.forecastData.list[i].dt}
						forecastIcon={this.state.forecastData.list[i].weather[0].icon}
						forecastTemp={this.state.forecastData.list[i].main.temp}
					/>
				);
			}
		}

		return (
			 <div className="container">
        <div style={colStyle} className="col-xs-12 col-sm-8 col-md-offset-3 col-md-5">
          <div style={panel} className="panel panel-default">
            <div style={panelHead} className="panel-heading">
              <Form callback={this.onSubmit} ref="form" />
              <CurrentWeather
                city={this.state.city}
                date={this.state.date}
                celsius={this.state.celsius}
                weatherIcon={this.state.weatherIcon}
                meta={this.state.meta}
                wind={this.state.wind}
                windDeg={this.state.windDeg}
                />
            </div>
            <div className="panel-body">
              <div className="col-xs-12">
                <div className="row">
                  {rows}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
		);
	}
});

ReactDOM.render(<WeatherContainer />, document.getElementById("main"));