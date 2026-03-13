import {
  call, take, put, select
} from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import * as mainActions from '@app/containers/Main/store/actions';
import { setSystemState } from '@app/shared/store/actions';
import { SharedStateType } from '../interface';
import { BridgeStateType } from '@app/containers/Main/interfaces';

import Utils from '@core/utils.js';

export function remoteEventChannel() {
  return eventChannel((emitter) => {
    Utils.initialize({
      "appname": "BEAM Bridge",
      "min_api_version": "6.2",
      "headless": false,
      "apiResultHandler": (error, result, full) => {
        if (!result?.error) {
          emitter(full);
        }
      }
    }, (err) => {
        Utils.download("./pipe_app.wasm", (err, bytes) => {
            Utils.callApi("ev_subunsub", {ev_system_state: true}, 
              (error, result, full) => {
                if (result) {
                  emitter({ id: 'init', bytes });
                }
              }
            );
        })
    });

    const unsubscribe = () => {
      emitter(END);
    };

    return unsubscribe;
  });
}


function* sharedSaga() {
  const remoteChannel = yield call(remoteEventChannel);

  while (true) {
    try {
      const payload: any = yield take(remoteChannel);
      switch (payload.id) {
        case 'ev_system_state':
          const appState = (yield select()) as {main: BridgeStateType, shared: SharedStateType};
          yield put(setSystemState(payload.result));

          if (appState.shared.isLoaded) {
            yield put(mainActions.loadAppParams.request(null));
          }

          break;
        
        case 'init':
          yield put(mainActions.loadAppParams.request(payload.bytes));
          yield put(mainActions.loadRate.request());
          break;

        default:
          break;
      }
    } catch (err) {
      remoteChannel.close();
    }
  }
}

export default sharedSaga;
