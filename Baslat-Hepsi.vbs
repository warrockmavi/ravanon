' RAVANON — Mağaza + Admin birlikte başlat (sessiz)
Option Explicit

Dim shell, fso, root, storeUrl, adminUrl, i

Set shell = CreateObject("WScript.Shell")
Set fso   = CreateObject("Scripting.FileSystemObject")

root     = fso.GetParentFolderName(WScript.ScriptFullName)
storeUrl = "http://localhost:8765"
adminUrl = "http://localhost:3000/admin"

' Mağaza
If Not ServerReady(storeUrl) Then
    shell.Run "wscript.exe //B """ & root & "\Baslat.vbs""", 0, False
    For i = 1 To 20
        WScript.Sleep 1000
        If ServerReady(storeUrl) Then Exit For
    Next
End If

' Admin
If Not ServerReady(adminUrl) Then
    shell.Run "wscript.exe //B """ & root & "\admin\Baslat-Admin.vbs""", 0, False
    For i = 1 To 35
        WScript.Sleep 1000
        If ServerReady(adminUrl) Then Exit For
    Next
End If

If ServerReady(storeUrl) Then shell.Run storeUrl, 1, False
If ServerReady(adminUrl) Then shell.Run adminUrl, 1, False

WScript.Quit 0

Function ServerReady(checkUrl)
    On Error Resume Next
    Dim http
    ServerReady = False
    Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    If http Is Nothing Then Set http = CreateObject("MSXML2.XMLHTTP")
    http.Open "GET", checkUrl, False
    http.setTimeouts 2000, 2000, 2000, 2000
    http.Send
    If Err.Number = 0 Then ServerReady = (http.Status >= 200 And http.Status < 500)
    On Error GoTo 0
End Function