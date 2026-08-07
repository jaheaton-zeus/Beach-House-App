// Main app — Shelter Cove edition (website)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showAdminBadge": true,
  "navStyle": "top",
  "homeLayout": "dashboard"
}/*EDITMODE-END*/;

function App() {
  const { TweaksPanel, TweakSection, TweakToggle, TweakRadio, useTweaks } = window;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const theme = THEMES.papaya;

  const [currentUser, setCurrentUser] = React.useState(null);
  const [screen, setScreen] = React.useState("home");
  const [bookingDates, setBookingDates] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigate = (s) => { setScreen(s); setMobileOpen(false); };

  const handleLogin = (user) => { setCurrentUser(user); setScreen("home"); };
  const handleLogout = () => { setCurrentUser(null); setScreen("home"); };

  const tweaksPanel = (
    <TweaksPanel>
      <TweakSection label="Display" />
      <TweakToggle label="Show admin badge" value={tweaks.showAdminBadge} onChange={v => setTweak("showAdminBadge", v)} />
      <TweakRadio label="Navigation style" value={tweaks.navStyle} options={["top", "sidebar"]} onChange={v => setTweak("navStyle", v)} />
      <TweakRadio label="Home layout" value={tweaks.homeLayout} options={["single", "dashboard"]} onChange={v => setTweak("homeLayout", v)} />
    </TweaksPanel>
  );

  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} theme={theme} />
        {tweaksPanel}
      </>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeScreen currentUser={currentUser} setScreen={navigate} theme={theme} layout={tweaks.homeLayout} />;
      case "calendar": return <CalendarScreen setScreen={navigate} setBookingDates={setBookingDates} theme={theme} />;
      case "book": return <BookScreen currentUser={currentUser} bookingDates={bookingDates} setScreen={navigate} theme={theme} />;
      case "mytrips": return <MyTripsScreen currentUser={currentUser} setScreen={navigate} theme={theme} />;
      case "info": case "rules": case "recs":
        return <HouseInfoScreen setScreen={navigate} theme={theme} initialTab={screen === "rules" ? "rules" : screen === "recs" ? "recs" : "rules"} />;
      case "supplies": return <SuppliesScreen currentUser={currentUser} setScreen={navigate} theme={theme} />;
      case "gallery": return <GalleryScreen setScreen={navigate} theme={theme} />;
      case "checkout": return <CheckoutScreen currentUser={currentUser} setScreen={navigate} theme={theme} />;
      case "admin": return currentUser.role === "admin" ? <AdminScreen currentUser={currentUser} setScreen={navigate} theme={theme} /> : <HomeScreen currentUser={currentUser} setScreen={navigate} theme={theme} layout={tweaks.homeLayout} />;
      default: return <HomeScreen currentUser={currentUser} setScreen={navigate} theme={theme} layout={tweaks.homeLayout} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", flexDirection: "column" }}>
      <SiteHeader
        screen={screen} setScreen={navigate} currentUser={currentUser} theme={theme}
        navStyle={tweaks.navStyle} showAdminBadge={tweaks.showAdminBadge}
        onLogout={handleLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />
      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        {tweaks.navStyle === "sidebar" && (
          <SidebarNav screen={screen} setScreen={navigate} currentUser={currentUser} theme={theme} />
        )}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 24px" }}>
            {renderScreen()}
          </div>
        </main>
      </div>
      {tweaksPanel}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
