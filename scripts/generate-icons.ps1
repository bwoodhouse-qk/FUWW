# Run from any directory. Generated PNGs are checked in; builds need no drawing dependencies.
Add-Type -AssemblyName System.Drawing
$iconDirectory = Join-Path $PSScriptRoot '../icons'
New-Item -ItemType Directory -Force -Path $iconDirectory | Out-Null
foreach ($size in @(16, 32, 48, 128)) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.ScaleTransform($size / 128.0, $size / 128.0)
    $pink = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#DB2777'))
    $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, 8)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $background = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $background.AddArc(2, 2, 32, 32, 180, 90)
    $background.AddArc(94, 2, 32, 32, 270, 90)
    $background.AddArc(94, 94, 32, 32, 0, 90)
    $background.AddArc(2, 94, 32, 32, 90, 90)
    $background.CloseFigure()
    $graphics.FillPath($pink, $background)
    # Handle, basket, and lower rail form a clear trolley silhouette.
    $points = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(21, 29),
        [System.Drawing.PointF]::new(33, 29),
        [System.Drawing.PointF]::new(45, 84),
        [System.Drawing.PointF]::new(99, 84)
    )
    $graphics.DrawLines($pen, $points)
    $basket = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(37, 43),
        [System.Drawing.PointF]::new(106, 43),
        [System.Drawing.PointF]::new(98, 68),
        [System.Drawing.PointF]::new(42, 68)
    )
    $graphics.DrawLines($pen, $basket)
    $graphics.FillEllipse($white, 44, 94, 14, 14)
    $graphics.FillEllipse($white, 85, 94, 14, 14)
    $bitmap.Save((Join-Path $iconDirectory "trolley-$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $background.Dispose()
    $pen.Dispose()
    $white.Dispose()
    $pink.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}
