import { createMachine, guard, invoke, reduce, state, transition } from "robot3";

const wait = (duration) => {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve();
            //reject(new Error('Impossible to work.'))
        }, duration);
    });
}

const transitionCancel = transition("cancel", 'idle');
const transitionInput = transition("input", 'edit', reduce((ctx, ev) => ({ ...ctx, editedTitle: ev.value })));
const transitionSubmit =  transition(
    "submit", 
    "loading", 
    guard((ctx) => (ctx.editedTitle && ctx.editedTitle !== ctx.title))
);

const machine =  createMachine(
    {
        idle: state(transition("edit", "edit")),
        edit: state(
            transitionCancel,
            transitionInput,
            transitionSubmit,
        ),
        loading: invoke(
            async () => {
               await wait(2000);
               return {"title": "Title from server."}
            },
            transition(
                "done", 
                "success",
                reduce((ctx, e) => ({...ctx, title: e.data.title}))
            ),
            transition(
                "error", 
                "error",
                reduce((ctx, e) => ({...ctx, error: e.error.message}))
            )
        ),
        success: invoke(
            () => wait(2000), 
            transition("done", "idle")
        ),
        error: state(
            transitionCancel,
            transitionInput,
            transitionSubmit,
            transition('dismiss', 'edit')
        )
    },
    () =>({ title: 'Hello World' }) 
);

export default machine;