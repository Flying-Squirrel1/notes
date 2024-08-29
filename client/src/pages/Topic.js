import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";




function Topic() {
    const { subject, block, topic} = useParams(); // Destructure route parameters
    const [data, setData] = useState(null); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors
    const [updating, setUpdating] = useState(false);
    const [refresher, setRefresher] = useState(1);
    const [updated, setUpdated] = useState("");
   
    const [term, setTerm] = useState("")
    const [defi, setDefi] = useState("")




    const updateTopic =async ()=>{
      if (updated === ""){
          return
      }
      try {
          const response = await fetch(`http://localhost:4000/${subject}/${block}/${topic}`, {
            method: 'PUT', // Specify the request method
            headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify([updated])
          });
          setRefresher(refresher+1);
          
          const data = await response.json(); // Parse the JSON response
          console.log('Success:', data); // Handle the response data as needed
          setLoading(true);
          
        } catch (error) {
          console.error('Error:', error); // Handle any errors that occur
        }
  }



    useEffect(() => {
      console.log("ran")
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/${subject}/${block}/${topic}`); // Fetch data from API
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json(); // Convert response to JSON
          setData(data); // Store the fetched data
          setUpdated(data.text);
        } catch (error) {
          setError(error); // Handle errors
        } finally {
          setLoading(false); // Set loading to false
        }
      };
  
      fetchData();
    }, [subject, block, topic, refresher]); // Re-run effect when `section` or `topic` changes
  
    if (loading) return <div>Loading...</div>; // Display loading message
    if (error) return <div>Error: {error.message}</div>; // Display error message
  
    return (
      <div>
        <h1>{` ${topic} `}</h1>

        {updating || <p>
            {data.text}
            <p className="clicx" onClick={()=>setUpdating(!updating)}>update notes</p>
        </p>
        }
        
        {updating && <div> <textarea rows={30} cols={120} value={updated} onChange={(e)=> setUpdated(e.target.value)}>
          sfdfdsf
        </textarea>
        <p className="clicx"  onClick={()=>{updateTopic(); setUpdating(!updating)}}>Submit Changes</p> 
        <p onClick={()=>{setUpdating(!updating);setUpdated(data.text)  }} className="clicx" > Cancel</p>
        </div>
        }
        

        <hr></hr>

        <div className="factsCol">

        <span className="factsCreate"><input type="text" onChange={(e)=>setTerm(e.target.value)} value={term}></input> : 
        <input  type="text" onChange={(e)=>setDefi(e.target.value)} value={defi}></input></span>

        </div>
        <Link to={`/${subject}/${block}`}>Back</Link>
      </div>
    );
}

export default Topic;