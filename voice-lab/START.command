#!/bin/bash
# Double-click this file in Finder to run the whole pipeline in a Terminal window (keeps the Mac awake).
cd "$(dirname "$0")"
chmod +x run.sh setup.sh make_ref.sh
caffeinate -dims ./run.sh
echo; echo "Done. Press Enter to close."; read -r
