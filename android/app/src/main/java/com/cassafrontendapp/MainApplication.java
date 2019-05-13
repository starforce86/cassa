package com.cassafrontendapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.rssignaturecapture.RSSignatureCapturePackage;

import fr.bamlab.rnimageresizer.ImageResizerPackage;
import io.realm.react.RealmReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.wonday.pdf.RCTPdfView;
import com.heng.wheel.WheelPackage;
import com.chirag.RNMail.RNMail;
import com.imagepicker.ImagePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.rnfs.RNFSPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.terrylinla.rnsketchcanvas.SketchCanvasPackage;
import io.invertase.firebase.RNFirebasePackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {


    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNHTMLtoPDFPackage(),
            new RNSharePackage(),
            new RSSignatureCapturePackage(),
            new RealmReactPackage(),
            new RNFetchBlobPackage(),
            new RCTPdfView(),
            new RNMail(),
            new ImagePickerPackage(),
            new RNCameraPackage(),
            new RNFSPackage(),
            new WheelPackage(),
            new LinearGradientPackage(),
            new RNFirebasePackage(),
            new SketchCanvasPackage(),
            new ImageResizerPackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
    public String getFileProviderAuthority() {
        return "com.cassafrontendapp";
    }
}
