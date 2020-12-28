import logo from './logo.svg';
import './App.css';
import { useMachine } from './ui/useMachine';
import machine from './ui/machine';
import { useCallback } from 'react';

function App() {
    const [state, context, send, can] = useMachine(machine);

    const editMode = !['idle', 'success'].includes(state);

    const dismiss = useCallback(() => {
        send('dismiss')
    }, [send]);
    //console.log(editMode, context, state)
    return (
        <div className="App">
            { state === 'success' && (<div onClose={dismiss} className="alert alert-success">Success</div>)}
            { state === 'error' && (<div onClose={dismiss} className="alert alert-danger">{context.error}</div>)}
            
            { !editMode ?
                (<h1> { context.title } </h1>)
                :
                (<>
                    {state === 'loading' && (<h1>Loading ...</h1>) }
                    { state !== 'loading' && (
                        <input type="text" disabled={!can('input')} defaultValue="Hello World"
                        onChange={(e) => send('input', { value: e.target.value })}
                        className="form-control" name="title" />
                        ) 
                    }
                    </>
                )
            }
            { editMode ?
                (<>
                    <button  disabled={!can('submit')} className="btn btn-primary" onClick={() => send('submit')}> Submit </button>
                    <button disabled={!can('cancel')} onClick={() => send('cancel')} className="btn btn-secondary"> Cancel </button>
                </>)
                :
                (<button onClick={() => send('edit')} className="btn btn-warning"> Edit </button>)
            }
        </div>
    );
}

export default App;
