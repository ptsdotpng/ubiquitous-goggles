/**
 * todo V0.0.1
 */

const html = (strings, ...exprs) => {
  return strings.reduce((p, c, i) => {
    return `${p}${c}${exprs[i] || ""}`
  }, "");
};

const main = (el) => {
  console.log("todo V0.0.1")

  el.innerHTML = html`
    <div>
      todos
    </div>
  `;
};

main(document.getElementById("out"))