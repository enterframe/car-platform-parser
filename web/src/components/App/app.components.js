import {useEventSource, useEventSourceListener} from "@react-nano/use-event-source"
import {useState} from "react"

export function App() {
  const [eventSource] = useEventSource("/events")
  const [items, setItems] = useState([])

  useEventSourceListener(eventSource, ["message"], ({data}) => {
    setItems(values => ([...values, JSON.parse(data)]))
  });

  return <>
    <div className="App">
      <h1>car-platforms</h1>
      {Array.isArray(items) && items.reverse().map(item =>
        <>
          <section>
            <a href={item.url} target="_blank">
              {item.date && <div className="date">{item.service}, {new Date(item.date).toLocaleString()}</div>}
              <h3 className="title">{item.title}</h3>
              {item.image && <img className="image" src={item.image}/>}
              <strong className="price">{item.price}</strong><br />
              {item.desc && item.desc.length > 0 && (
                <ul className="desc">
                  {item.desc.map(d => {
                    <li>{d}</li>
                  })}
                </ul>
              )}
            </a>
          </section>
          <hr/>
        </>
      )}
    </div>
  </>
}
