export function createAsyncThunk<Returned = any, ThunkArg = void, ThunkApiConfig = { rejectValue?: any }>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: {
      dispatch: any;
      getState: any;
      rejectWithValue: (v: any) => { __rtkReject: true; payload: any };
    }
  ) => Promise<Returned | { __rtkReject: true; payload: any }>,
) {
  const pendingType = `${typePrefix}/pending`;
  const fulfilledType = `${typePrefix}/fulfilled`;
  const rejectedType = `${typePrefix}/rejected`;

  const makeActionCreator = (type: string) => {
    const ac = (payload?: any, meta?: any) =>
      payload === undefined ? { type, meta } : { type, payload, meta };
    (ac as any).type = type;
    return ac;
  };

  const pending = makeActionCreator(pendingType);
  const fulfilled = makeActionCreator(fulfilledType);
  const rejected = makeActionCreator(rejectedType);

  const thunkActionCreator = (arg?: ThunkArg) => {
    return async (dispatch: any, getState: any) => {
      dispatch(pending());
      // keep the literal `true` type for __rtkReject to satisfy TS
      const thunkAPI: {
        dispatch: any;
        getState: any;
        rejectWithValue: (v: any) => { __rtkReject: true; payload: any };
      } = {
        dispatch,
        getState,
        rejectWithValue: (payload: any) =>
          ({ __rtkReject: true as const, payload } as { __rtkReject: true; payload: any }),
      };

      try {
        const result = await payloadCreator(arg as ThunkArg, thunkAPI);
        if (result && typeof result === 'object' && (result as any).__rtkReject) {
          dispatch(rejected((result as any).payload));
          return Promise.reject((result as any).payload);
        }
        dispatch(fulfilled(result));
        return result;
      } catch (err: any) {
        if (err && typeof err === 'object' && (err as any).__rtkReject) {
          dispatch(rejected((err as any).payload));
          return Promise.reject((err as any).payload);
        }
        const payload = err && err.message ? err.message : err;
        dispatch(rejected(payload));
        return Promise.reject(payload);
      }
    };
  };

  (thunkActionCreator as any).pending = pending;
  (thunkActionCreator as any).fulfilled = fulfilled;
  (thunkActionCreator as any).rejected = rejected;
  (thunkActionCreator as any).typePrefix = typePrefix;

  return thunkActionCreator as any;
}
