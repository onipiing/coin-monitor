import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as actions from "../actions/actions";
import ExchangeComponent from "./Exchange";

class DashboardComponent extends Component {
  componentDidMount() {
    this.props.actions.requestAllAPIData();
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { coincap, exmo, bleutrade } = this.props.exchangeData;
    return coincap && exmo && bleutrade ? (
      <div>
        <div>
          <Link to="/report">
            <button className="linkToReport">30 Minute Report new</button>
          </Link>
        </div>
        <ExchangeComponent
          id="coincapExchange"
          exchangeName="Coincap"
          ethData={coincap.ethData}
          ltcData={coincap.ltcData}
          dashData={coincap.dashData}
        />
        <ExchangeComponent
          id="exmoExchange"
          exchangeName="Exmo"
          ethData={exmo.ethData}
          ltcData={exmo.ltcData}
          dashData={exmo.dashData}
        />
        <ExchangeComponent
          id="bleutradeExchange"
          exchangeName="Bleutrade"
          ethData={bleutrade.ethData}
          ltcData={bleutrade.ltcData}
          dashData={bleutrade.dashData}
        />
      </div>
    ) : (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  }
}

DashboardComponent.propTypes = {
  coincap: PropTypes.string,
  exmo: PropTypes.string,
  bleutrade: PropTypes.string
};

const mapStateToProps = state => {
  return {
    exchangeData: state.exchangeData,
    currencyValues: state.currencyValues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
