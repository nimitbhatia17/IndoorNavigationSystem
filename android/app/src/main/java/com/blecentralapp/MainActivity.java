package com.blecentralapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle;
// import android.bluetooth.BluetoothManager;
// import android.bluetooth.BluetoothAdapter;
// import android.content.Intent;
// import android.content.Context;
// import android.content.Activity;

public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BLECentralApp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView
   * is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or
   * the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {

    private static final int REQUEST_ENABLE_BT = 1;
    // private Promise mPickerPromise;

    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e.
      // React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    // public void onActivityResult(Activity activity, int requestCode) {
    // if(requestCode==REQUEST_ENABLE_BT)

    // {
    // if (mPickerPromise != null) {
    // if (resultCode == Activity.RESULT_CANCELED) {
    // mPickerPromise.reject("Image picker was cancelled");
    // } else if (resultCode == Activity.RESULT_OK) {
    // BluetoothAdapter bAdapter = BluetoothAdapter.getDefaultAdapter();
    // bAdapter.enable();
    // }

    // mPickerPromise = null;
    // }
    // }
    // }

    // String[] permissions = { "android.permission.BLUETOOTH" };
    // Button btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(null);
      // setContentView(R.layout.activity_main);
      // btn = findViewById(R.id.btn);
      // btn.setOnClickListener(new View.OnClickListener() {
      //   @Override
      //   public void onClick(View v) {
      //     requestPermissions(permissions, 80);
      //   }
      // });
    }

    // public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
    //     @NonNull int[] grantResults) {
    //   super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    //   if (requestCode == 80) {
    //     if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
    //       Toast.makeText(this, "DownloadCOde", Toast.LENGTH_SHORT).show();
    //     } else {

    //       Toast.makeText(this, "Download cancel", Toast.LENGTH_SHORT).show();
    //     }
    //   }

    // }
  }
}