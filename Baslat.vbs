' RAVANON — Tamamen Sessiz Baslatici (HICBIR PENCERE ACILMAZ)
Option Explicit

Dim shell, fso, root, port, url, i, maxWait, psCmd

Set shell = CreateObject("WScript.Shell")
Set fso   = CreateObject("Scripting.FileSystemObject")

root    = fso.GetParentFolderName(WScript.ScriptFullName)
port    = 8765
url     = "http://localhost:" & port
maxWait = 25

If Not ServerReady(url) Then
    ' PowerShell ile tamamen gizli sunucu (CMD YOK)
    psCmd = "Set-Location -LiteralPath '" & root & "'; " & _
            "Start-Process -FilePath 'npx.cmd' -ArgumentList '--yes','serve','-l','" & port & "' " & _
            "-WindowStyle Hidden -WorkingDirectory '" & root & "'"
    shell.Run "powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command " & Chr(34) & psCmd & Chr(34), 0, False

    For i = 1 To maxWait
        WScript.Sleep 1000
        If ServerReady(url) Then Exit For
    Next
End If

If ServerReady(url) Then
    shell.Run url, 1, False
Else
    shell.Run """" & root & "\index.html""", 1, False
End If

WScript.Quit 0

Function ServerReady(checkUrl)
    On Error Resume Next
    Dim http
    ServerReady = False
    Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    If http Is Nothing Then Set http = CreateObject("MSXML2.XMLHTTP")
    http.Open "GET", checkUrl, False
    http.setTimeouts 1500, 1500, 1500, 1500
    http.Send
    If Err.Number = 0 Then ServerReady = (http.Status = 200)
    On Error GoTo 0
End Function