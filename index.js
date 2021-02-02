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

//#region components
const render_todo = (cursor) => (t, i) => {
  const cl = i === cursor ? `class="active"` : "";
  const checked = `[${t[1] ?  "x" : " "}]`

  return html`
    <li ${cl}>${t[0]}:${checked}:${t[2]}</li>
  `;
};

//#endregion

// consts 
const cmd_chars = "abcdefghijklmnopqrstuvwxyz -_+1234567890"


const main = (el, todos, prmpt) => {
  //#region state
  const s = {
    cursor: 0,
    mode: 1, 
    cmd_buff: ""
  }
  //#endregion

  //#region render
  const render = () => {
    const rt = render_todo(s.cursor)
    const rendered_todos = todos.map(rt);

    el.innerHTML = html`
      <div class="todos">
        <h1>todos</h1>
        <ul>
          ${rendered_todos.join("\n")}
        </ul>
      </div>
    `;
  }
  //#endregion

  //#region commands
  const set_mode_normal = () => {
    prmpt.innerHTML = ""
    s.mode = 1
    s.cmd_buff = ""
  }

  const set_mode_cmd = () => {
    prmpt.innerHTML = ""
    s.mode = 0
    s.cmd_buff = ":"
  }

  const normal_key = k => {
    prmpt.innerHTML = k
    if(k === ":") {
      set_mode_cmd();
    } else if (k === "j") {
      s.cursor += 1
    } else if (k === "k") {
      s.cursor -= 1
    } else if (k === "Enter") {
      todos[s.cursor][1] = !todos[s.cursor][1]
    }
  }

  const try_command = () => {
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
  }
  
  const cmd_key = k => {
    // ignore
    if(k === "Shift") return

    // normal ok chars
    if(cmd_chars.indexOf(k.toLowerCase()) !== -1) {
      s.cmd_buff += k
      prmpt.innerHTML = s.cmd_buff
      return;
    }

    // mode chage/control
    if(k === "Escape") {
      set_mode_normal()
    } else if (k === "Backspace") {
      s.cmd_buff = s.cmd_buff.slice(0, -1)
      prmpt.innerHTML = s.cmd_buff
    } else if (k === "Enter") {
      try_command()
    }
  }
  
  const on_input = e => {
    s.mode 
      ? normal_key(e.key)
      : cmd_key(e.key)

    render()
  }
  // #endregion
  // #region init
  const init = () => {
    console.log("todo V0.0.1")
    render()
  }

  init();
  return on_input;
  // #endregion
};

export { main }