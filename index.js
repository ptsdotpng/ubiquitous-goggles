/**
 * todo V0.0.1
 */
//#region utils
const html = (strings, ...exprs) => {
  return strings.reduce((p, c, i) => {
    return `${p}${c}${exprs[i] || ""}`
  }, "");
};
//#endregion
//#region data
const DATA =[[1,1,"init"],[2,true,"kb prep"],[3,true,"print todos"],[4,true,"select todo"],[5,true,"complete todo"],[6,true,"output data"],[7,true,"new todo"]]
//#endregion
// todo: refactor
const prmpt = document.getElementById("prompt")

const main = (el, todos) => {
  const s = {
    cursor: 0,
    mode: 1, 
    cmd_buff: ""
  }

  const render = () => {
    const rendered_todos = todos.map((t, i) => {
      const cl = i === s.cursor ? `class="active"` : "";

      return html`
        <li ${cl}>${t[0]}:[${t[1] ?  "x" : " "}]:${t[2]}</li>
      `;
    });
    el.innerHTML = html`
      <div class="todos">
        <h1>todos</h1>
        <ul>
          ${rendered_todos.join("\n")}
        </ul>
      </div>
    `;
  }

  const normal_key = k => {
    prmpt.innerHTML = k
    if(k === ":") {
      prmpt.innerHTML = ""
      s.mode = 0
      s.cmd_buff = ":"
    } else if (k === "j") {
      s.cursor += 1
    } else if (k === "k") {
      s.cursor -= 1
    } else if (k === "Enter") {
      todos[s.cursor][1] = !todos[s.cursor][1]
    }
  }

  const cmd_key = k => {
    if(k === "Shift") return

    if(k === "Escape") {
      prmpt.innerHTML = ""
      s.mode = 1
      s.cmd_buff = ""
    } else if (k === "Backspace") {
      console.log(124,  s.cmd_buff , s.cmd_buff.slice(0, -1))
      s.cmd_buff = s.cmd_buff.slice(0, -1)
      prmpt.innerHTML = s.cmd_buff
    } else if (k === "Enter") {

      if(s.cmd_buff === ":export") {
        navigator.clipboard.writeText(
          JSON.stringify(todos)
        )
      } else if (s.cmd_buff.slice(0,4) === ":add") {
        const next_id = Math.max(...todos.map(([i]) => i)) + 1
        todos.push(
          [next_id,0,s.cmd_buff.slice(5)]
        )
        prmpt.innerHTML = ""
        s.mode = 1
        s.cmd_buff = ":"
      }

    } else {
      s.cmd_buff += k
      prmpt.innerHTML = s.cmd_buff
    }
  }

  const on_input = e => {
    s.mode 
      ? normal_key(e.key)
      : cmd_key(e.key)

    render()
  }

  const init = () => {
    console.log("todo V0.0.1")
    render()
  }

  init();
  return on_input;
};

const inst = main(
  document.getElementById("out"),
  DATA
)
//to use later -> j3 will route events
document.addEventListener("keyup", inst)