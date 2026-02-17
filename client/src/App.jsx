/**
 * App.jsx is responsible for:
 * Calling the Express backend, Sending patient data, Receiving AI-generated narratives, Displaying results
 * 
 * It's the main screen of the web app and React renders this component into the browser.
 */

/**
 * React Hooks 
 * 
 * useState - stores data
 * useEffect - runs code automatically
 * 
 */

import { useEffect, useState } from "react";

//export deafult App() displays the main screen. This functions draws the page. 
export default function App() {

  /**
   * This text appears on the screen to tell the user if the backend is reachable.
   * It starts as "Checking API..." and changes after we try to contact the server.
   */
  const [status, setStatus] = useState("Checking API...");
  /**
   * This will store the response from the server (for example: { ok: true }).
   * We show it on the screen so we can confirm the connection is working.
   */
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    /**
     * This reads the backend address from .env file in client. 
     * We do this so we can change the server address in the .env file later without editing code here.
     */
    const base = import.meta.env.VITE_API_BASE;

    /**
     * This sends a test request to the backend to confirm that React can communicate with Express.
     */
    fetch(`${base}/health`)
      .then((response) => {
        /**
         * fetch() does not automatically fail on server errors,
         * so we manually check and treat bad responses as failures.
         */
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Convert the response into usable data.
        return response.json();
      })
      .then((data) => {
        // Save the server response so we can display it.
        setPayload(data);
        // Update the message on the screen to show success.
        setStatus("API Connected");
      })
      .catch((err) => {
        /**
         * If something goes wrong (server down, wrong port, etc)
         * show an error message so you know what the problem is.
         */
        console.error(err);
        setStatus(`API Not Connected: ${err.message}`);
      });
  }, []);
  /**
   * The empty [] means this runs only once when the page loads.
   * We only need to test the connection one time.
   */

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>ePCR AI Narrative</h1>
      <p>{status}</p>

      {payload && (
        <pre style={{ background: "#000000", padding: 12, borderRadius: 8 }}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  );
}
