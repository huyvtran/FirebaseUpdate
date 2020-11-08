package com.abivin.vappx;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.newrelic.agent.android.NewRelic;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "vAppX";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    NewRelic.withApplicationToken(
            "AAb4ac329b52aea062af0567d942266b3db4f8051c"
    ).start(this.getApplication());

    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }
}
