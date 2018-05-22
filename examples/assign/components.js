const containerStyle = {
  border: "3px solid green",
  padding: "1rem",
  margin: "1rem"
}

export const NameOnly = ({ name, onUpdate }) => (
  <div id="name" style={containerStyle}>
    <h2>Name Only</h2>
    <input type="text" value={name} onChange={onUpdate} />
    <h3>{name}</h3>
  </div>
)

export const CountOnly = ({ count, onInc, onDec }) => (
  <div id="count" style={containerStyle}>
    <h2>Count Only</h2>
    <h3>{count} apples</h3>
    <button onClick={onInc}>+</button>
    <button onClick={onDec}>-</button>
  </div>
)

export const NameAndCount = ({ count, onInc, onDec, name, onUpdate }) => (
  <div id="countAndName" style={containerStyle}>
    <h2>Name and Count</h2>
    <h3>
      {name} has {count} apples
    </h3>
    <button onClick={onInc}>+</button>
    <button onClick={onDec}>-</button>

    <h2>{name}</h2>
    <input type="text" onChange={onUpdate} value={name} />
  </div>
)
