import { all, call, put, takeEvery } from "redux-saga/effects";

import * as actions from "../actions/actions";
import { fetchData } from "../api";

function formatPrice(price) {
  return Number(price)
    .toFixed(5)
    .toString();
}

//COINCAP
function* requestCoincapAPIData() {
  try {
    const [ethData, ltcData, dashData] = yield all([
      call(fetchData, "http://coincap.io/page/ETH"),
      call(fetchData, "http://coincap.io/page/LTC"),
      call(fetchData, "http://coincap.io/page/DASH")
    ]);
    yield put(
      actions.receiveCoincapAPIData({
        ethData: formatPrice(ethData.price_btc),
        ltcData: formatPrice(ltcData.price_btc),
        dashData: formatPrice(dashData.price_btc)
      })
    );
    return { ethData, ltcData, dashData };
  } catch (error) {
    console.log(error);
    yield put({ type: actions.COINCAP_REQUEST_FAILURE, error });
  }
}

//EXMO
function* requestExmoAPIData() {
  try {
    const data = yield call(fetchData, "https://api.exmo.com/v1/ticker/");
    yield put(
      actions.receiveExmoAPIData({
        ethData: formatPrice(data.ETH_BTC.buy_price),
        ltcData: formatPrice(data.LTC_BTC.buy_price),
        dashData: formatPrice(data.DASH_BTC.buy_price)
      })
    );
    return data;
  } catch (error) {
    console.log(error);
    yield put({ type: actions.EXMO_REQUEST_FAILURE, error });
  }
}

//Bluetrade
function* requestBleutradeAPIData() {
  try {
    const [ethData, ltcData, dashData] = yield all([
      call(fetchData, "https://bleutrade.com/api/v2/public/getticker?market=ETH_BTC"),
      call(fetchData, "https://bleutrade.com/api/v2/public/getticker?market=LTC_BTC"),
      call(fetchData, "https://bleutrade.com/api/v2/public/getticker?market=DASH_BTC")
    ]);
    yield put(
      actions.receiveBleutradeAPIData({
        ethData: formatPrice(ethData.result[0].Last),
        ltcData: formatPrice(ltcData.result[0].Last),
        dashData: formatPrice(dashData.result[0].Last)
      })
    );
    return { ethData, ltcData, dashData };
  } catch (error) {
    console.log(error);
    yield put({ type: actions.BLEUTRADE_REQUEST_FAILURE, error });
  }
}

function* requestAllAPIData() {
  try {
    const [coincapData, exmoData, bleutradeData] = yield all([
      call(requestCoincapAPIData),
      call(requestExmoAPIData),
      call(requestBleutradeAPIData)
    ]);
    yield put(
      actions.receiveAllAPIData({
        ethValues: {
          coincap: coincapData.ethData.price_btc,
          exmo: exmoData.ETH_BTC.buy_price,
          bleutrade: bleutradeData.ethData.result[0].Last
        },
        ltcValues: {
          coincap: coincapData.ltcData.price_btc,
          exmo: exmoData.LTC_BTC.buy_price,
          bleutrade: bleutradeData.ltcData.result[0].Last
        },
        dashValues: {
          coincap: coincapData.dashData.price_btc,
          exmo: exmoData.DASH_BTC.buy_price,
          bleutrade: bleutradeData.dashData.result[0].Last
        }
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export function* coincapSaga() {
  yield takeEvery(actions.REQUEST_COINCAP_API_DATA, requestCoincapAPIData);
}

export function* exmoSaga() {
  yield takeEvery(actions.REQUEST_EXMO_API_DATA, requestExmoAPIData);
}

export function* bleutradeSaga() {
  yield takeEvery(actions.REQUEST_BLEUTRADE_API_DATA, requestBleutradeAPIData);
}

export function* apiDataSaga() {
  yield takeEvery(actions.REQUEST_ALL_API_DATA, requestAllAPIData);
}
