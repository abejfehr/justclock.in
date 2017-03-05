package com.led_on_off.led;

import android.content.Context;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.os.AsyncTask;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;


public class ledControl extends ActionBarActivity {

   // Button btnOn, btnOff, btnDis;
    Button On, Discnt;
    String address = null;
    private ProgressDialog progress;
    BluetoothAdapter myBluetooth = null;
    BluetoothSocket btSocket = null;
    private boolean isBtConnected = false;
    //SPP UUID. Look for it
    static final UUID myUUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        Intent newint = getIntent();
        address = newint.getStringExtra(DeviceList.EXTRA_ADDRESS); //receive the address of the bluetooth device

        //view of the ledControl
        setContentView(R. layout.activity_led_control);

        //call the widgets
        On = (Button)findViewById(R.id.on);
        Discnt = (Button)findViewById(R.id.discnt);

        new ConnectBT().execute(); //Call the class to connect

        //commands to be sent to bluetooth
        On.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
//                turnOnLed();      //method to turn on
                getData();
            }
        });

        Discnt.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Disconnect(); //close connection
            }
        });


    }

    private void Disconnect()
    {
        if (btSocket!=null) //If the btSocket is busy
        {
            try
            {
                btSocket.close(); //close connection
            }
            catch (IOException e)
            { msg("Error");}
        }
        finish(); //return to the first layout

    }

    private void getData() {
        if (btSocket != null) {
            try {
                btSocket.getOutputStream().write("g".toString().getBytes());

                JSONObject employee;
                JSONArray  allEmployees = new JSONArray();
                ArrayList<Integer> bytes = new ArrayList();
                final int idLen = 8, timeLen = 10;

                String employeeID = "", employeeTime = "";
                int value = 0;
                boolean shouldReadId = false, shouldReadTime = false;
                Context context = getApplicationContext();
                int duration = Toast.LENGTH_SHORT;

                CharSequence text = "";

                Toast toast = Toast.makeText(context, text, duration);

                // Allows the input stream to fill with data
                Thread.sleep(1000);

                while (btSocket.getInputStream().available() > 0) {
                    value = btSocket.getInputStream().read();

                    if (shouldReadId && value != 3) {
                        bytes.add(value);
                    } else if (shouldReadId && value == 3) {
                        // bytes is currently an ID
                        byte[] b = new byte[idLen];
                        for (int i = 0; i < idLen; i++) {
                            b[i] = bytes.get(i).byteValue();
                        }
                        bytes.clear();
                        employeeID = new String(b, "UTF-8");
                        text = "id: " + String.valueOf(employeeID);

                        toast = Toast.makeText(context, text, duration);
                        toast.show();

                        shouldReadId = false;
                        shouldReadTime = true;
                    } else if (shouldReadTime && value != 25) {
                        bytes.add(value);
                    } else if (shouldReadTime && value == 25) {
                        // bytes is currently a timestamp
                        byte[] b = new byte[timeLen];
                        for (int i = 0; i < timeLen; i++) {
                            b[i] = bytes.get(i).byteValue();
                        }
                        bytes.clear();
                        employeeTime = new String(b, "UTF-8");
                        text = "time: " + String.valueOf(employeeTime);

                        toast = Toast.makeText(context, text, duration);
                        toast.show();

                        employee = new JSONObject();
                        employee.put("employee_id", employeeID);
                        employee.put("timestamp", employeeTime);
                        allEmployees.put(employee);

                        shouldReadTime = false;
                    } else if (value == 2) {
                        shouldReadId = true;
                    }
                }

                // Send the data to the server
                JSONObject body = new JSONObject();
                try {
                    body.put("data", allEmployees);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RequestQueue queue = Volley.newRequestQueue(this);
                String url ="https://www.justclock.in/api/import";

                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, body, new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                    }
                });

                jsonObjectRequest.setRetryPolicy(new DefaultRetryPolicy(
                        0,
                        DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                        DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

                // Add the request to the RequestQueue.
                queue.add(jsonObjectRequest);

            } catch (IOException e) {
                msg("Error");
            } catch (InterruptedException e) {
                msg("Error");
            } catch (JSONException e) {
                msg("Error");
            }
        }
    }

    private void turnOffLed()
    {
        if (btSocket!=null)
        {
            try
            {
                btSocket.getOutputStream().write("0".toString().getBytes());
            }
            catch (IOException e)
            {
                msg("Error");
            }
        }
    }

    private void turnOnLed()
    {
        if (btSocket!=null)
        {
            try
            {
                btSocket.getOutputStream().write("1".toString().getBytes());
            }
            catch (IOException e)
            {
                msg("Error");
            }
        }
    }

    // fast way to call Toast
    private void msg(String s)
    {
        Toast.makeText(getApplicationContext(),s,Toast.LENGTH_LONG).show();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_led_control, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }



    private class ConnectBT extends AsyncTask<Void, Void, Void>  // UI thread
    {
        private boolean ConnectSuccess = true; //if it's here, it's almost connected

        @Override
        protected void onPreExecute()
        {
            progress = ProgressDialog.show(ledControl.this, "Connecting...", "Please wait!!!");  //show a progress dialog
        }

        @Override
        protected Void doInBackground(Void... devices) //while the progress dialog is shown, the connection is done in background
        {
            try
            {
                if (btSocket == null || !isBtConnected)
                {
                 myBluetooth = BluetoothAdapter.getDefaultAdapter();//get the mobile bluetooth device
                 BluetoothDevice dispositivo = myBluetooth.getRemoteDevice(address);//connects to the device's address and checks if it's available
                 btSocket = dispositivo.createInsecureRfcommSocketToServiceRecord(myUUID);//create a RFCOMM (SPP) connection
                 BluetoothAdapter.getDefaultAdapter().cancelDiscovery();
                 btSocket.connect();//start connection
                }
            }
            catch (IOException e)
            {
                ConnectSuccess = false;//if the try failed, you can check the exception here
            }
            return null;
        }
        @Override
        protected void onPostExecute(Void result) //after the doInBackground, it checks if everything went fine
        {
            super.onPostExecute(result);

            if (!ConnectSuccess)
            {
                msg("Connection Failed. Is it a SPP Bluetooth? Try again.");
                finish();
            }
            else
            {
                msg("Connected.");
                isBtConnected = true;
            }
            progress.dismiss();
        }
    }
}
