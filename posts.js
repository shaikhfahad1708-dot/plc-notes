const PLC_POSTS = [
  {
    date: "2026-11-20",
    tag: "SCL",
    title: "Cooling Pump Latch & Safety Fault Interlock in SCL",
    summary:
      "Using Static memory in a Function Block (FB) so run and fault states persist across PLC scan cycles, ensuring a tripped pump never auto-restarts until an explicit reset.",
    shopFloor:
      "Press START and the pump stays on even after releasing the button. If a fault hits, the pump kills instantly and START is locked out until STOP / RESET clears the alarm.",
    codeLabel: "Block_1 [FB1] — SCL",
    code: `// 1. FAULT LATCH & RESET
IF #fault_sim THEN
    #latched_fault := TRUE;
    #latched_run := FALSE;
END_IF;

IF #stop_reset THEN
    #latched_run := FALSE;
    #latched_fault := FALSE;
END_IF;

// 2. START LATCH (BLOCKED WHILE FAULT IS LATCHED)
IF #start_cmd AND NOT #latched_fault THEN
    #latched_run := TRUE;
END_IF;

// 3. DRIVE OUTPUTS
#pump_on := #latched_run AND NOT #latched_fault;
#fault_out := #latched_fault;`
  },
  {
    date: "2026-11-19",
    tag: "WinCC",
    title: "KTP700 Basic PN Button Events & Lamp Animations",
    summary:
      "Wiring momentary HMI pushbuttons and status indicators to an S7-1500 Instance DB without sticky bit bugs.",
    shopFloor:
      "Use SetBitWhileKeyPressed on physical-style START/STOP buttons so the PLC only sees a pulse while your finger is on the screen, and let the PLC handle the latch.",
    codeLabel: "WinCC KTP700 Root Screen Checklist",
    code: `1. Button Press Event -> SetBitWhileKeyPressed -> Block_1_DB.start_cmd
2. Circle Appearance Animation -> Block_1_DB.pump_on (0 = Gray, 1 = Green)
3. Fault Circle Animation -> Block_1_DB.fault_out (0 = Gray, 1 = Red)
4. I/O Field (Mode: Output) -> Block_1_DB.temp_c`
  },
  {
    date: "2026-11-18",
    tag: "Shop-Floor",
    title: "Deterministic S7-1500 Batch Tank State Machine (CASE OF)",
    summary:
      "Structuring Fill -> Mix -> Drain cycles with CASE #state OF and TON watchdog timers so only one state executes per scan cycle and stuck valves trigger fault codes.",
    shopFloor:
      "Instead of messy overlapping IF flags, the machine moves step-by-step (0 Idle -> 10 Fill -> 20 Mix -> 30 Drain). If filling takes longer than the watchdog timer, it stops safely and flags a fault.",
    codeLabel: "State Machine Pattern — SCL",
    code: `CASE #state OF
    0:  #fill_cmd := FALSE; #drain_cmd := FALSE;
    10: #fill_cmd := TRUE;
        IF #level >= #high_sp THEN #state := 20; END_IF;
    20: #fill_cmd := FALSE;
        IF #mix_timer.Q THEN #state := 30; END_IF;
    30: #drain_cmd := TRUE;
        IF #level <= #low_sp THEN #state := 0; END_IF;
END_CASE;`
  }
];
