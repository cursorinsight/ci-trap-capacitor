package com.cursorinsight.trap.capacitor.example;

import android.os.Bundle;

import com.cursorinsight.trap.capacitor.CapacitorTrapPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CapacitorTrapPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
