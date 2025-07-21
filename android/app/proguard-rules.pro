# Mantém as classes do Capacitor para não quebrar funcionalidades nativas
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# Firebase Messaging (notificações push)
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# WebView com JavaScript (usado por Capacitor)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Mantém classes do AndroidX usadas indiretamente
-keep class androidx.** { *; }
-dontwarn androidx.**

# Mantém classes do Google Services (caso Firebase use Analytics, Crashlytics etc)
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**